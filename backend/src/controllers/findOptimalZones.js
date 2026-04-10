// // services/findOptimalZones.js

// // Used for geospatial calculations
// // Functions used later:
// // distance() → distance between 2 coordinates
// // point() → create geo point
// // convex() → convex hull
// // circle() → fallback polygon
// const turf = require("@turf/turf");

// // ─── DBSCAN ───────────────────────────────────────────────────────────────────
// // Density-Based Spatial Clustering

// // Groups nearby points into clusters
// // Identifies dense regions
// // eps: km, minPts: minimum neighbours to be a core point
// function dbscan(points, eps, minPts) {
//     const n = points.length;
//     // labels[i] tells cluster of point i
//     // Values:
//     // -2 → unvisited
//     // -1 → noise (not part of cluster)
//     // >=0 → cluster id
//     const labels = new Array(n).fill(-2); // -2 = unvisited, -1 = noise
//     let clusterId = 0; // Count of clusters

//     // Finds all points within eps distance
//     function neighbors(i) {
//         return points.reduce((acc, p, j) => {
//             // Computes distance between point i and point j
//             const d = turf.distance(
//                 turf.point([points[i].lon, points[i].lat]),
//                 turf.point([p.lon, p.lat]),
//                 { units: "kilometers" }
//             );
//             if (d <= eps) acc.push(j); // Add neighbor if within radius
//             return acc;
//         }, []);
//     }

//     // Iterate over all points
//     for (let i = 0; i < n; i++) {
//         if (labels[i] !== -2) continue; // Skip if already visited
//         const nb = neighbors(i); // Get neighbors of point i
//         if (nb.length < minPts) { labels[i] = -1; continue; } // Mark as noise if not enough neighbors

//         labels[i] = clusterId;
//         const stack = nb.filter(j => j !== i); // Start new cluster use stack for dfs expension

//         // Expand cluster like DFS
//         while (stack.length) {
//             const j = stack.pop(); //Take next point
//             if (labels[j] === -1) labels[j] = clusterId; // Mark as noise if not enough neighbors
//             if (labels[j] !== -2) continue; // Skip if already visited
//             labels[j] = clusterId; // Mark as visited
//             const nb2 = neighbors(j); // Get neighbors of point j
//             if (nb2.length >= minPts) {
//                 nb2.forEach(k => {
//                     if (labels[k] === -2 || labels[k] === -1) stack.push(k); // add neighbors to stack
//                 });
//             }
//         }
//         clusterId++; // Move to next cluster
//     }

//     return { labels, numClusters: clusterId }; // Output cluster assignments
// }

// // ─── CONVEX HULL ─────────────────────────────────────────────────────────────
// // Creates polygon around points
// function buildPolygon(points) {
//     if (points.length < 3) {
//         // fallback: small circle around centroid
//         const c = centroidOf(points);
//         const circle = turf.circle([c.lon, c.lat], 0.1, { units: "kilometers" });
//         return circle.geometry.coordinates[0].map(([lon, lat]) => ({ lat, lon }));
//     }
//     const fc = turf.featureCollection(
//         points.map(p => turf.point([p.lon, p.lat]))
//     );
//     const hull = turf.convex(fc);
//     if (!hull) return points.map(p => ({ lat: p.lat, lon: p.lon }));
//     return hull.geometry.coordinates[0].map(([lon, lat]) => ({ lat, lon }));
// }

// // ─── CENTROID ────────────────────────────────────────────────────────────────
// function centroidOf(points) {
//     return {
//         lat: points.reduce((s, p) => s + p.lat, 0) / points.length,
//         lon: points.reduce((s, p) => s + p.lon, 0) / points.length,
//     };
// }

// // ─── WEBER COST ──────────────────────────────────────────────────────────────
// // For a candidate point, sum the distances to the nearest amenity of each required type
// function weberCost(candidate, pointsByType, requiredTypes) {
//     let total = 0;
//     for (const type of requiredTypes) {
//         const group = pointsByType[type];
//         if (!group || group.length === 0) return Infinity; // missing type
//         const nearest = Math.min(...group.map(p =>
//             turf.distance(
//                 turf.point([candidate.lon, candidate.lat]),
//                 turf.point([p.lon, p.lat]),
//                 { units: "kilometers" }
//             )
//         ));
//         total += nearest;
//     }
//     return total;
// }

// // ─── SCORE A CLUSTER ─────────────────────────────────────────────────────────
// function scoreCluster(clusterPoints, officeLat, officeLon, requiredTypes) {
//     const centroid = centroidOf(clusterPoints);

//     const distFromOffice = turf.distance(
//         turf.point([officeLon, officeLat]),
//         turf.point([centroid.lon, centroid.lat]),
//         { units: "kilometers" }
//     );

//     // internal spread — max distance from centroid to any point in cluster
//     const spread = Math.max(...clusterPoints.map(p =>
//         turf.distance(
//             turf.point([centroid.lon, centroid.lat]),
//             turf.point([p.lon, p.lat]),
//             { units: "kilometers" }
//         )
//     ));

//     // weber cost from centroid
//     const pointsByType = {};
//     clusterPoints.forEach(p => {
//         if (!pointsByType[p.type]) pointsByType[p.type] = [];
//         pointsByType[p.type].push(p);
//     });
//     const weberFromCentroid = weberCost(centroid, pointsByType, requiredTypes);

//     const typeCount = new Set(clusterPoints.map(p => p.type)).size;

//     // lower cost = better, so negate for sorting
//     return (
//         - distFromOffice * 15
//         - spread * 10
//         - weberFromCentroid * 8
//         + typeCount * 12
//         + clusterPoints.length * 3
//     );
// }

// // ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
// function findOptimalZones({ amenityRows, officeLat, officeLon, requiredTypes, topN = 3 }) {
//     if (!amenityRows.length) return { phase: 0, zones: [] };

//     // tune eps: ~300m neighbourhoods. minPts = number of required types
//     const eps = 0.3;
//     const minPts = Math.max(2, requiredTypes.length);

//     const { labels, numClusters } = dbscan(amenityRows, eps, minPts);

//     // group points by cluster
//     const clusters = {};
//     amenityRows.forEach((pt, i) => {
//         const cid = labels[i];
//         if (cid < 0) return; // noise
//         if (!clusters[cid]) clusters[cid] = [];
//         clusters[cid].push(pt);
//     });

//     // ── PHASE 1: find clusters that cover all required types ──────────────────
//     const validClusters = [];

//     for (const [cid, pts] of Object.entries(clusters)) {
//         const typesInCluster = new Set(pts.map(p => p.type));
//         const missing = requiredTypes.filter(t => !typesInCluster.has(t));
//         if (missing.length > 0) continue; // not valid

//         const centroid = centroidOf(pts);
//         const score = scoreCluster(pts, officeLat, officeLon, requiredTypes);
//         const polygon = buildPolygon(pts);

//         const distFromOffice = turf.distance(
//             turf.point([officeLon, officeLat]),
//             turf.point([centroid.lon, centroid.lat]),
//             { units: "kilometers" }
//         );

//         validClusters.push({
//             rank: null, // assigned after sort
//             score: Math.round(score * 10) / 10,
//             centroid,
//             polygon,
//             dist_from_office_km: Math.round(distFromOffice * 100) / 100,
//             types_covered: [...typesInCluster],
//             missing_types: [],
//             amenity_count: pts.length,
//             amenities: pts,
//             phase: 1,
//         });
//     }

//     if (validClusters.length > 0) {
//         validClusters.sort((a, b) => b.score - a.score);
//         return {
//             phase: 1,
//             zones: validClusters.slice(0, topN).map((z, i) => ({ ...z, rank: i + 1 })),
//         };
//     }

//     // ── PHASE 2: no valid cluster — Weber optimal fallback ────────────────────
//     const allClusterCentroids = Object.entries(clusters).map(([cid, pts]) => ({
//         cid,
//         centroid: centroidOf(pts),
//         types: new Set(pts.map(p => p.type)),
//         pts,
//     }));

//     if (allClusterCentroids.length === 0) return { phase: 0, zones: [] };

//     // weight each centroid by how many required types it contributes
//     const weights = allClusterCentroids.map(c =>
//         requiredTypes.filter(t => c.types.has(t)).length
//     );
//     const totalWeight = weights.reduce((s, w) => s + w, 0) || 1;

//     const optimalPoint = {
//         lat: allClusterCentroids.reduce((s, c, i) => s + c.centroid.lat * weights[i], 0) / totalWeight,
//         lon: allClusterCentroids.reduce((s, c, i) => s + c.centroid.lon * weights[i], 0) / totalWeight,
//     };

//     const polygon = buildPolygon(allClusterCentroids.map(c => c.centroid));
//     const typesCovered = new Set(allClusterCentroids.flatMap(c => [...c.types]));
//     const stillMissing = requiredTypes.filter(t => !typesCovered.has(t));

//     const distFromOffice = turf.distance(
//         turf.point([officeLon, officeLat]),
//         turf.point([optimalPoint.lon, optimalPoint.lat]),
//         { units: "kilometers" }
//     );

//     return {
//         phase: 2,
//         zones: [{
//             rank: 1,
//             score: null,
//             centroid: optimalPoint,
//             polygon,
//             dist_from_office_km: Math.round(distFromOffice * 100) / 100,
//             types_covered: [...typesCovered],
//             missing_types: stillMissing,
//             amenity_count: amenityRows.length,
//             amenities: amenityRows,
//             note: "No single neighbourhood has all types. This is the Weber-optimal zone — minimises total travel to all amenity groups.",
//             phase: 2,
//         }],
//     };
// }

// module.exports = { findOptimalZones };







// const turf = require("@turf/turf");

// function dbscan(points, eps, minPts) {
//     const n = points.length;
//     const labels = new Array(n).fill(-2);
//     let clusterId = 0;

//     function neighbors(i) {
//         return points.reduce((acc, p, j) => {
//             const d = turf.distance(
//                 turf.point([points[i].lon, points[i].lat]),
//                 turf.point([p.lon, p.lat]),
//                 { units: "kilometers" }
//             );
//             if (d <= eps) acc.push(j);
//             return acc;
//         }, []);
//     }

//     for (let i = 0; i < n; i++) {
//         if (labels[i] !== -2) continue;
//         const nb = neighbors(i);
//         if (nb.length < minPts) { labels[i] = -1; continue; }

//         labels[i] = clusterId;
//         const stack = nb.filter(j => j !== i);

//         while (stack.length) {
//             const j = stack.pop();
//             if (labels[j] === -1) labels[j] = clusterId;
//             if (labels[j] !== -2) continue;
//             labels[j] = clusterId;
//             const nb2 = neighbors(j);
//             if (nb2.length >= minPts) {
//                 nb2.forEach(k => {
//                     if (labels[k] === -2 || labels[k] === -1) stack.push(k);
//                 });
//             }
//         }
//         clusterId++;
//     }

//     return { labels, numClusters: clusterId };
// }

// function buildPolygon(points) {
//     if (points.length < 3) {
//         const c = centroidOf(points);
//         const circle = turf.circle([c.lon, c.lat], 0.3, { units: "kilometers" });
//         return circle.geometry.coordinates[0].map(([lon, lat]) => ({ lat, lon }));
//     }
//     const fc = turf.featureCollection(points.map(p => turf.point([p.lon, p.lat])));
//     const hull = turf.convex(fc);
//     if (!hull) {
//         const c = centroidOf(points);
//         const circle = turf.circle([c.lon, c.lat], 0.3, { units: "kilometers" });
//         return circle.geometry.coordinates[0].map(([lon, lat]) => ({ lat, lon }));
//     }
//     return hull.geometry.coordinates[0].map(([lon, lat]) => ({ lat, lon }));
// }

// function centroidOf(points) {
//     return {
//         lat: points.reduce((s, p) => s + p.lat, 0) / points.length,
//         lon: points.reduce((s, p) => s + p.lon, 0) / points.length,
//     };
// }

// // ─── KEY FIX: score by FACILITY CATEGORIES, not raw types ───────────────────
// // Maps raw DB types back to user-facing facility categories
// const TYPE_TO_FACILITY = {
//     hospital: "Hospital", clinic: "Hospital", blood_bank: "Hospital",
//     school: "School", college: "School", educational_institution: "School",
//     gym: "Gym", fitness_centre: "Gym", sports_centre: "Gym",
//     park: "Park", garden: "Park",
//     metro_station: "Metro Station", station: "Metro Station", bus_station: "Metro Station",
//     marketplace: "Mall", supermarket: "Mall", shopping_mall: "Mall",
//     restaurant: "Restaurant", fast_food: "Restaurant", cafe: "Restaurant",
//     airport: "Airport",
//     office: "Office Area", company: "Office Area",
//     university: "University",
// };

// function getCoveredFacilities(points, requiredFacilities) {
//     const covered = new Set();
//     points.forEach(p => {
//         const facility = TYPE_TO_FACILITY[p.type?.toLowerCase()];
//         if (facility && requiredFacilities.includes(facility)) {
//             covered.add(facility);
//         }
//     });
//     return covered;
// }

// function scoreCluster(clusterPoints, officeLat, officeLon, requiredFacilities) {
//     const centroid = centroidOf(clusterPoints);

//     const distFromOffice = turf.distance(
//         turf.point([officeLon, officeLat]),
//         turf.point([centroid.lon, centroid.lat]),
//         { units: "kilometers" }
//     );

//     const spread = Math.max(...clusterPoints.map(p =>
//         turf.distance(
//             turf.point([centroid.lon, centroid.lat]),
//             turf.point([p.lon, p.lat]),
//             { units: "kilometers" }
//         )
//     ));

//     const coveredFacilities = getCoveredFacilities(clusterPoints, requiredFacilities);
//     const coverageRatio = coveredFacilities.size / requiredFacilities.length;

//     return (
//         + coverageRatio * 50        // coverage is the most important factor
//         - distFromOffice * 3        // penalise distance from user
//         - spread * 5                // penalise spread out clusters
//         + clusterPoints.length * 1  // reward more amenities
//     );
// }

// // ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
// function findOptimalZones({ amenityRows, officeLat, officeLon, requiredTypes, requiredFacilities, topN = 3 }) {
//     if (!amenityRows.length) return { phase: 0, zones: [] };

//     // ── Try progressively larger eps until we get enough clusters ────────────
//     let labels, numClusters, clusters;
//     const epsValues = [0.5, 0.8, 1.2, 2.0]; // km — start at 500m, go up to 2km
//     const minPts = 2; // just need 2 points to form a cluster

//     for (const eps of epsValues) {
//         ({ labels, numClusters } = dbscan(amenityRows, eps, minPts));

//         clusters = {};
//         amenityRows.forEach((pt, i) => {
//             const cid = labels[i];
//             if (cid < 0) return;
//             if (!clusters[cid]) clusters[cid] = [];
//             clusters[cid].push(pt);
//         });

//         if (Object.keys(clusters).length >= topN) break; // enough clusters found
//     }

//     // ── PHASE 1: rank clusters by facility coverage ───────────────────────────
//     const scoredClusters = Object.entries(clusters).map(([cid, pts]) => {
//         const centroid = centroidOf(pts);
//         const coveredFacilities = getCoveredFacilities(pts, requiredFacilities);
//         const missingFacilities = requiredFacilities.filter(f => !coveredFacilities.has(f));
//         const score = scoreCluster(pts, officeLat, officeLon, requiredFacilities);
//         const polygon = buildPolygon(pts);

//         const distFromOffice = turf.distance(
//             turf.point([officeLon, officeLat]),
//             turf.point([centroid.lon, centroid.lat]),
//             { units: "kilometers" }
//         );

//         return {
//             rank: null,
//             score: Math.round(score * 10) / 10,
//             centroid,
//             polygon,
//             dist_from_office_km: Math.round(distFromOffice * 100) / 100,
//             facilities_covered: [...coveredFacilities],
//             missing_facilities: missingFacilities,
//             types_covered: [...new Set(pts.map(p => p.type))],
//             amenity_count: pts.length,
//             amenities: pts,
//             phase: 1,
//         };
//     });

//     // Sort by score, take top N with at least 1 facility covered
//     const validClusters = scoredClusters
//         .filter(z => z.facilities_covered.length > 0)
//         .sort((a, b) => b.score - a.score)
//         .slice(0, topN)
//         .map((z, i) => ({ ...z, rank: i + 1 }));

//     if (validClusters.length >= topN) {
//         return { phase: 1, zones: validClusters };
//     }

//     // ── PHASE 2: not enough clusters — grid-based fallback ───────────────────
//     // Divide the bounding box into a grid, score each cell
//     const lats = amenityRows.map(p => p.lat);
//     const lons = amenityRows.map(p => p.lon);
//     const minLat = Math.min(...lats), maxLat = Math.max(...lats);
//     const minLon = Math.min(...lons), maxLon = Math.max(...lons);

//     const gridSize = 8; // 8x8 grid
//     const gridZones = [];

//     for (let i = 0; i < gridSize; i++) {
//         for (let j = 0; j < gridSize; j++) {
//             const cellMinLat = minLat + (i / gridSize) * (maxLat - minLat);
//             const cellMaxLat = minLat + ((i + 1) / gridSize) * (maxLat - minLat);
//             const cellMinLon = minLon + (j / gridSize) * (maxLon - minLon);
//             const cellMaxLon = minLon + ((j + 1) / gridSize) * (maxLon - minLon);

//             const cellPoints = amenityRows.filter(p =>
//                 p.lat >= cellMinLat && p.lat < cellMaxLat &&
//                 p.lon >= cellMinLon && p.lon < cellMaxLon
//             );

//             if (cellPoints.length === 0) continue;

//             const centroid = {
//                 lat: (cellMinLat + cellMaxLat) / 2,
//                 lon: (cellMinLon + cellMaxLon) / 2,
//             };

//             const coveredFacilities = getCoveredFacilities(cellPoints, requiredFacilities);
//             if (coveredFacilities.size === 0) continue;

//             const missingFacilities = requiredFacilities.filter(f => !coveredFacilities.has(f));
//             const score = scoreCluster(cellPoints, officeLat, officeLon, requiredFacilities);

//             const distFromOffice = turf.distance(
//                 turf.point([officeLon, officeLat]),
//                 turf.point([centroid.lon, centroid.lat]),
//                 { units: "kilometers" }
//             );

//             gridZones.push({
//                 rank: null,
//                 score: Math.round(score * 10) / 10,
//                 centroid,
//                 polygon: [
//                     { lat: cellMinLat, lon: cellMinLon },
//                     { lat: cellMinLat, lon: cellMaxLon },
//                     { lat: cellMaxLat, lon: cellMaxLon },
//                     { lat: cellMaxLat, lon: cellMinLon },
//                     { lat: cellMinLat, lon: cellMinLon },
//                 ],
//                 dist_from_office_km: Math.round(distFromOffice * 100) / 100,
//                 facilities_covered: [...coveredFacilities],
//                 missing_facilities: missingFacilities,
//                 types_covered: [...new Set(cellPoints.map(p => p.type))],
//                 amenity_count: cellPoints.length,
//                 amenities: cellPoints,
//                 phase: 2,
//             });
//         }
//     }

//     // Merge phase 1 results with phase 2 grid results, deduplicate by proximity
//     const allZones = [...validClusters, ...gridZones]
//         .sort((a, b) => b.score - a.score);

//     // Deduplicate: skip zones whose centroid is within 0.5km of an already selected zone
//     const finalZones = [];
//     for (const zone of allZones) {
//         const tooClose = finalZones.some(selected =>
//             turf.distance(
//                 turf.point([zone.centroid.lon, zone.centroid.lat]),
//                 turf.point([selected.centroid.lon, selected.centroid.lat]),
//                 { units: "kilometers" }
//             ) < 0.5
//         );
//         if (!tooClose) finalZones.push(zone);
//         if (finalZones.length >= topN) break;
//     }

//     if (finalZones.length === 0) return { phase: 0, zones: [] };

//     return {
//         phase: finalZones.some(z => z.phase === 2) ? 2 : 1,
//         zones: finalZones.map((z, i) => ({ ...z, rank: i + 1 })),
//     };
// }

// module.exports = { findOptimalZones };




const turf = require("@turf/turf");

// Maps raw DB types back to user-facing facility categories
const TYPE_TO_FACILITY = {
    hospital: "Hospital", clinic: "Hospital", blood_bank: "Hospital",
    school: "School", college: "School", educational_institution: "School",
    gym: "Gym", fitness_centre: "Gym", sports_centre: "Gym",
    park: "Park", garden: "Park",
    metro_station: "Metro Station", station: "Metro Station", bus_station: "Metro Station",
    marketplace: "Mall", supermarket: "Mall", shopping_mall: "Mall",
    restaurant: "Restaurant", fast_food: "Restaurant", cafe: "Restaurant",
    airport: "Airport",
    office: "Office Area", company: "Office Area",
    university: "University",
    supermarket: "Supermarket", convenience: "Supermarket"
};

function getCoveredFacilities(points, requiredFacilities) {
    const covered = new Set();
    points.forEach(p => {
        const facility = TYPE_TO_FACILITY[p.type?.toLowerCase()];
        if (facility && requiredFacilities.includes(facility)) {
            covered.add(facility);
        }
    });
    return covered;
}

/**
 * Instead of arbitrary clustering, we create "Candidate Points" from the amenities 
 * and check which 500m-800m radius (walking distance) captures the most variety.
 */
function findOptimalZones({ amenityRows, officeLat, officeLon, requiredFacilities, topN = 5 }) {
    if (!amenityRows || amenityRows.length === 0) return { phase: 0, zones: [] };

    const officePoint = turf.point([officeLon, officeLat]);
    
    // 1. Filter amenities to ensure they are actually within a reasonable reach of the office
    // (The SQL query likely does this, but we double-check here)
    const candidates = amenityRows.map(amt => {
        const amtPoint = turf.point([amt.lon, amt.lat]);
        const dist = turf.distance(officePoint, amtPoint, { units: 'kilometers' });
        return { ...amt, distFromOffice: dist };
    });

    // 2. We will evaluate each amenity as a potential "center" of a living zone
    // and see how many other required amenities it pulls in within walking distance (~800m)
    // const WALKING_RADIUS = 0.8; // approx 10-12 mins walking
    const WALKING_RADIUS = 2.0;
    const scoredZones = candidates.map(centerAmt => {
        const centerPoint = turf.point([centerAmt.lon, centerAmt.lat]);
        
        // Find all amenities within walking distance of THIS specific amenity
        const localAmenities = candidates.filter(other => {
            const otherPoint = turf.point([other.lon, other.lat]);
            return turf.distance(centerPoint, otherPoint, { units: 'kilometers' }) <= WALKING_RADIUS;
        });

        const coveredReqs = getCoveredFacilities(localAmenities, requiredFacilities);
        const coverageScore = (coveredReqs.size / requiredFacilities.length) * 100;
        
        // Penalty: How far is this "Zone Center" from the Office?
        // We want the zone to be close to work.
        const proximityPenalty = centerAmt.distFromOffice * 10;

        return {
            centroid: { lat: centerAmt.lat, lon: centerAmt.lon },
            score: coverageScore - proximityPenalty,
            facilities_covered: Array.from(coveredReqs),
            amenity_count: localAmenities.length,
            amenities: localAmenities,
            dist_from_office_km: centerAmt.distFromOffice
        };
    });

    // 3. Deduplicate and Rank
    // Sort by highest score (Variety - Distance Penalty)
    const sorted = scoredZones.sort((a, b) => b.score - a.score);
    
    const finalZones = [];
    for (const zone of sorted) {
        // Ensure we don't pick 3 zones that are essentially the same street corner
        const isTooClose = finalZones.some(final => {
            const d = turf.distance(
                turf.point([zone.centroid.lon, zone.centroid.lat]),
                turf.point([final.centroid.lon, final.centroid.lat]),
                { units: 'kilometers' }
            );
            return d < 0.5; // Keep zones at least 500m apart to ensure variety
        });

        if (!isTooClose) {
            // Generate a simple circular polygon for the UI to represent the "Zone"
            const circle = turf.circle([zone.centroid.lon, zone.centroid.lat], 0.4, { units: 'kilometers', steps: 10 });
            zone.polygon = circle.geometry.coordinates[0].map(coord => ({ lon: coord[0], lat: coord[1] }));
            
            finalZones.push(zone);
        }
        if (finalZones.length >= topN) break;
    }

    return {
        phase: 1,
        zones: finalZones.map((z, i) => ({ ...z, rank: i + 1 }))
    };
}

module.exports = { findOptimalZones };
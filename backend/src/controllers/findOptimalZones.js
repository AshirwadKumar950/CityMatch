// services/findOptimalZones.js

// Used for geospatial calculations
// Functions used later:
// distance() → distance between 2 coordinates
// point() → create geo point
// convex() → convex hull
// circle() → fallback polygon
const turf = require("@turf/turf");

// ─── DBSCAN ───────────────────────────────────────────────────────────────────
// Density-Based Spatial Clustering

// Groups nearby points into clusters
// Identifies dense regions
// eps: km, minPts: minimum neighbours to be a core point
function dbscan(points, eps, minPts) {
    const n = points.length;
    // labels[i] tells cluster of point i
    // Values:
    // -2 → unvisited
    // -1 → noise (not part of cluster)
    // >=0 → cluster id
    const labels = new Array(n).fill(-2); // -2 = unvisited, -1 = noise
    let clusterId = 0; // Count of clusters

    // Finds all points within eps distance
    function neighbors(i) {
        return points.reduce((acc, p, j) => {
            // Computes distance between point i and point j
            const d = turf.distance(
                turf.point([points[i].lon, points[i].lat]),
                turf.point([p.lon, p.lat]),
                { units: "kilometers" }
            );
            if (d <= eps) acc.push(j); // Add neighbor if within radius
            return acc;
        }, []);
    }

    // Iterate over all points
    for (let i = 0; i < n; i++) {
        if (labels[i] !== -2) continue; // Skip if already visited
        const nb = neighbors(i); // Get neighbors of point i
        if (nb.length < minPts) { labels[i] = -1; continue; } // Mark as noise if not enough neighbors

        labels[i] = clusterId;
        const stack = nb.filter(j => j !== i); // Start new cluster use stack for dfs expension

        // Expand cluster like DFS
        while (stack.length) {
            const j = stack.pop(); //Take next point
            if (labels[j] === -1) labels[j] = clusterId; // Mark as noise if not enough neighbors
            if (labels[j] !== -2) continue; // Skip if already visited
            labels[j] = clusterId; // Mark as visited
            const nb2 = neighbors(j); // Get neighbors of point j
            if (nb2.length >= minPts) {
                nb2.forEach(k => {
                    if (labels[k] === -2 || labels[k] === -1) stack.push(k); // add neighbors to stack
                });
            }
        }
        clusterId++; // Move to next cluster
    }

    return { labels, numClusters: clusterId }; // Output cluster assignments
}

// ─── CONVEX HULL ─────────────────────────────────────────────────────────────
// Creates polygon around points
function buildPolygon(points) {
    if (points.length < 3) {
        // fallback: small circle around centroid
        const c = centroidOf(points);
        const circle = turf.circle([c.lon, c.lat], 0.1, { units: "kilometers" });
        return circle.geometry.coordinates[0].map(([lon, lat]) => ({ lat, lon }));
    }
    const fc = turf.featureCollection(
        points.map(p => turf.point([p.lon, p.lat]))
    );
    const hull = turf.convex(fc);
    if (!hull) return points.map(p => ({ lat: p.lat, lon: p.lon }));
    return hull.geometry.coordinates[0].map(([lon, lat]) => ({ lat, lon }));
}

// ─── CENTROID ────────────────────────────────────────────────────────────────
function centroidOf(points) {
    return {
        lat: points.reduce((s, p) => s + p.lat, 0) / points.length,
        lon: points.reduce((s, p) => s + p.lon, 0) / points.length,
    };
}

// ─── WEBER COST ──────────────────────────────────────────────────────────────
// For a candidate point, sum the distances to the nearest amenity of each required type
function weberCost(candidate, pointsByType, requiredTypes) {
    let total = 0;
    for (const type of requiredTypes) {
        const group = pointsByType[type];
        if (!group || group.length === 0) return Infinity; // missing type
        const nearest = Math.min(...group.map(p =>
            turf.distance(
                turf.point([candidate.lon, candidate.lat]),
                turf.point([p.lon, p.lat]),
                { units: "kilometers" }
            )
        ));
        total += nearest;
    }
    return total;
}

// ─── SCORE A CLUSTER ─────────────────────────────────────────────────────────
function scoreCluster(clusterPoints, officeLat, officeLon, requiredTypes) {
    const centroid = centroidOf(clusterPoints);

    const distFromOffice = turf.distance(
        turf.point([officeLon, officeLat]),
        turf.point([centroid.lon, centroid.lat]),
        { units: "kilometers" }
    );

    // internal spread — max distance from centroid to any point in cluster
    const spread = Math.max(...clusterPoints.map(p =>
        turf.distance(
            turf.point([centroid.lon, centroid.lat]),
            turf.point([p.lon, p.lat]),
            { units: "kilometers" }
        )
    ));

    // weber cost from centroid
    const pointsByType = {};
    clusterPoints.forEach(p => {
        if (!pointsByType[p.type]) pointsByType[p.type] = [];
        pointsByType[p.type].push(p);
    });
    const weberFromCentroid = weberCost(centroid, pointsByType, requiredTypes);

    const typeCount = new Set(clusterPoints.map(p => p.type)).size;

    // lower cost = better, so negate for sorting
    return (
        - distFromOffice * 15
        - spread * 10
        - weberFromCentroid * 8
        + typeCount * 12
        + clusterPoints.length * 3
    );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
function findOptimalZones({ amenityRows, officeLat, officeLon, requiredTypes, topN = 3 }) {
    if (!amenityRows.length) return { phase: 0, zones: [] };

    // tune eps: ~300m neighbourhoods. minPts = number of required types
    const eps = 0.3;
    const minPts = Math.max(2, requiredTypes.length);

    const { labels, numClusters } = dbscan(amenityRows, eps, minPts);

    // group points by cluster
    const clusters = {};
    amenityRows.forEach((pt, i) => {
        const cid = labels[i];
        if (cid < 0) return; // noise
        if (!clusters[cid]) clusters[cid] = [];
        clusters[cid].push(pt);
    });

    // ── PHASE 1: find clusters that cover all required types ──────────────────
    const validClusters = [];

    for (const [cid, pts] of Object.entries(clusters)) {
        const typesInCluster = new Set(pts.map(p => p.type));
        const missing = requiredTypes.filter(t => !typesInCluster.has(t));
        if (missing.length > 0) continue; // not valid

        const centroid = centroidOf(pts);
        const score = scoreCluster(pts, officeLat, officeLon, requiredTypes);
        const polygon = buildPolygon(pts);

        const distFromOffice = turf.distance(
            turf.point([officeLon, officeLat]),
            turf.point([centroid.lon, centroid.lat]),
            { units: "kilometers" }
        );

        validClusters.push({
            rank: null, // assigned after sort
            score: Math.round(score * 10) / 10,
            centroid,
            polygon,
            dist_from_office_km: Math.round(distFromOffice * 100) / 100,
            types_covered: [...typesInCluster],
            missing_types: [],
            amenity_count: pts.length,
            amenities: pts,
            phase: 1,
        });
    }

    if (validClusters.length > 0) {
        validClusters.sort((a, b) => b.score - a.score);
        return {
            phase: 1,
            zones: validClusters.slice(0, topN).map((z, i) => ({ ...z, rank: i + 1 })),
        };
    }

    // ── PHASE 2: no valid cluster — Weber optimal fallback ────────────────────
    const allClusterCentroids = Object.entries(clusters).map(([cid, pts]) => ({
        cid,
        centroid: centroidOf(pts),
        types: new Set(pts.map(p => p.type)),
        pts,
    }));

    if (allClusterCentroids.length === 0) return { phase: 0, zones: [] };

    // weight each centroid by how many required types it contributes
    const weights = allClusterCentroids.map(c =>
        requiredTypes.filter(t => c.types.has(t)).length
    );
    const totalWeight = weights.reduce((s, w) => s + w, 0) || 1;

    const optimalPoint = {
        lat: allClusterCentroids.reduce((s, c, i) => s + c.centroid.lat * weights[i], 0) / totalWeight,
        lon: allClusterCentroids.reduce((s, c, i) => s + c.centroid.lon * weights[i], 0) / totalWeight,
    };

    const polygon = buildPolygon(allClusterCentroids.map(c => c.centroid));
    const typesCovered = new Set(allClusterCentroids.flatMap(c => [...c.types]));
    const stillMissing = requiredTypes.filter(t => !typesCovered.has(t));

    const distFromOffice = turf.distance(
        turf.point([officeLon, officeLat]),
        turf.point([optimalPoint.lon, optimalPoint.lat]),
        { units: "kilometers" }
    );

    return {
        phase: 2,
        zones: [{
            rank: 1,
            score: null,
            centroid: optimalPoint,
            polygon,
            dist_from_office_km: Math.round(distFromOffice * 100) / 100,
            types_covered: [...typesCovered],
            missing_types: stillMissing,
            amenity_count: amenityRows.length,
            amenities: amenityRows,
            note: "No single neighbourhood has all types. This is the Weber-optimal zone — minimises total travel to all amenity groups.",
            phase: 2,
        }],
    };
}

module.exports = { findOptimalZones };
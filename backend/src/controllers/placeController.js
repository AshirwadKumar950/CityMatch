// const { query } = require("../config/db");
// const { findOptimalZones } = require("./findOptimalZones");

// // Map user-facing facility names to one or more PostgreSQL place types
// const FACILITY_TYPE_MAP = {
// 	Hospital: ["hospital", "clinic", "blood_bank"],
// 	School: ["school", "college", "educational_institution"],
// 	Mall: ["marketplace", "supermarket", "shopping_mall"],
// 	Gym: ["gym", "fitness_centre", "sports_centre"],
// 	Park: ["park", "garden"],
// 	"Metro Station": ["metro_station", "station", "bus_station"],
// 	Restaurant: ["restaurant", "fast_food", "cafe"],
// 	Airport: ["airport"],
// 	"Office Area": ["office", "company", "it", "government", "public_building"],
// 	"Bus Stop": ["bus_station"],
// 	University: ["university", "college"],
// 	Supermarket: ["supermarket", "marketplace", "convenience"],
// };

// const toMaxDistanceKm = (distance) => {
// 	const value = Number(distance?.value);
// 	if (Number.isNaN(value) || value <= 0) return 3;

// 	if (distance?.unit === "km") return value;

// 	const speedByModeKmPerMin = {
// 		walking: 0.083,
// 		cycling: 0.25,
// 		driving: 0.67,
// 	};

// 	const speed = speedByModeKmPerMin[distance?.travelMode] || speedByModeKmPerMin.walking;
// 	return Math.max(0.5, value * speed);
// };

// const normalizeRequestedTypes = (facilities = []) => {
// 	const mapped = facilities.flatMap((facility) => FACILITY_TYPE_MAP[facility] || []);
// 	return [...new Set(mapped.map((item) => item.toLowerCase()))];
// };

// // NEW: maps expanded db types back to the original facility label the user picked
// // needed so findOptimalZones can check coverage per user-facing category
// const buildTypeToFacilityMap = (facilities = []) => {
// 	const map = {};
// 	facilities.forEach((facility) => {
// 		const dbTypes = FACILITY_TYPE_MAP[facility] || [];
// 		dbTypes.forEach((t) => {
// 			map[t.toLowerCase()] = facility;
// 		});
// 	});
// 	return map;
// };

// const searchPlaces = async (req, res) => {
// 	try {
// 		// CHANGED: added top_n, removed limit (we need all points for clustering)
// 		const { latitude, longitude, facilities = [], distance = {}, top_n = 3 } = req.body;

// 		const lat = Number(latitude);
// 		const lon = Number(longitude);

// 		if (Number.isNaN(lat) || Number.isNaN(lon)) {
// 			return res.status(400).json({ message: "Valid latitude and longitude are required" });
// 		}

// 		const maxDistanceKm = toMaxDistanceKm(distance);
// 		const requestedTypes = normalizeRequestedTypes(facilities);

// 		if (requestedTypes.length === 0) {
// 			return res.status(400).json({ message: "At least one valid facility type is required" });
// 		}

// 		// CHANGED: removed the 50-row cap — DBSCAN needs all points in the radius
// 		const sql = `
// 			SELECT
// 				id,
// 				name,
// 				latitude,
// 				longitude,
// 				type,
// 				ROUND((ST_Distance(
// 					location,
// 					ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
// 				) / 1000)::numeric, 3) AS distance_km
// 			FROM places
// 			WHERE location IS NOT NULL
// 				AND ST_DWithin(
// 					location,
// 					ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
// 					$3 * 1000
// 				)
// 				AND (
// 					COALESCE(array_length($4::text[], 1), 0) = 0
// 					OR lower(type) = ANY($4::text[])
// 				)
// 			ORDER BY distance_km ASC
// 			LIMIT 1000
// 		`;

// 		// CHANGED: removed safeLimit, hardcoded 1000 as the ceiling
// 		const result = await query(sql, [lon, lat, maxDistanceKm, requestedTypes, 1000]);

// 		if (result.rows.length === 0) {
// 			return res.json({
// 				search_radius_km: maxDistanceKm,
// 				total_amenities_found: 0,
// 				phase: 0,
// 				zones: [],
// 				reason: "No amenities found in the given range",
// 			});
// 		}

// 		// NEW: rows from postgres use "latitude"/"longitude" as column names
// 		// findOptimalZones expects "lat"/"lon" — remap here
// 		const amenityRows = result.rows.map((row) => ({
// 			id: row.id,
// 			name: row.name,
// 			lat: Number(row.latitude),
// 			lon: Number(row.longitude),
// 			type: row.type,
// 			distance_km: Number(row.distance_km),
// 		}));

// 		// Input:
// 		// all amenities
// 		// user location
// 		// required types
// 		// topN
// 		// Output:
// 		// clusters
// 		// ranking
// 		// zones
// 		// NEW: pass everything to findOptimalZones
// 		const { phase, zones } = findOptimalZones({
// 			amenityRows,
// 			officeLat: lat,
// 			officeLon: lon,
// 			requiredTypes: requestedTypes,    // expanded db-level types e.g. ["hospital","clinic","blood_bank"]
// 			requiredFacilities: facilities,   // original user labels e.g. ["Hospital","Gym"]
// 			topN: Number(top_n) || 3,
// 		});

// 		return res.json({
// 			search_radius_km: maxDistanceKm,
// 			total_amenities_found: result.rows.length,
// 			phase,   // 1 = valid clusters found, 2 = weber fallback, 0 = no data
// 			zones,
// 		});

// 	} catch (error) {
// 		console.error("Place search error:", error.message);
// 		return res.status(500).json({ message: "Failed to fetch places" });
// 	}
// };

// module.exports = {
// 	searchPlaces,
// };



// // Frontend Request
// //       ↓
// // Extract input
// //       ↓
// // Convert distance → km
// //       ↓
// // Convert facilities → DB types
// //       ↓
// // SQL query (PostGIS)
// //       ↓
// // Get all nearby points
// //       ↓
// // Convert to {lat, lon}
// //       ↓
// // Run DBSCAN + scoring
// //       ↓
// // Return best zones



const supabase = require("../config/supabaseClient");
const { findOptimalZones } = require("./findOptimalZones");

// Map user-facing facility names to one or more PostgreSQL place types
const FACILITY_TYPE_MAP = {
	Hospital: ["hospital", "clinic", "blood_bank"],
	School: ["school", "college", "educational_institution"],
	Mall: ["marketplace", "supermarket", "shopping_mall"],
	Gym: ["gym", "fitness_centre", "sports_centre"],
	Park: ["park", "garden"],
	"Metro Station": ["metro_station", "station", "bus_station"],
	Restaurant: ["restaurant", "fast_food", "cafe"],
	Airport: ["airport"],
	"Office Area": ["office", "company", "it", "government", "public_building"],
	"Bus Stop": ["bus_station"],
	University: ["university", "college"],
	Supermarket: ["supermarket", "marketplace", "convenience"],
};

const toMaxDistanceKm = (distance) => {
	const value = Number(distance?.value);
	if (Number.isNaN(value) || value <= 0) return 3;

	if (distance?.unit === "km") return value;

	const speedByModeKmPerMin = {
		walking: 0.083,
		cycling: 0.25,
		driving: 0.67,
	};

	const speed = speedByModeKmPerMin[distance?.travelMode] || speedByModeKmPerMin.walking;
	return Math.max(0.5, value * speed);
};

const normalizeRequestedTypes = (facilities = []) => {
	const mapped = facilities.flatMap((facility) => FACILITY_TYPE_MAP[facility] || []);
	return [...new Set(mapped.map((item) => item.toLowerCase()))];
};

const searchPlaces = async (req, res) => {
	try {
		const { latitude, longitude, facilities = [], distance = {}, top_n = 3 } = req.body;

		const lat = Number(latitude);
		const lon = Number(longitude);

		if (Number.isNaN(lat) || Number.isNaN(lon)) {
			return res.status(400).json({ message: "Valid latitude and longitude are required" });
		}

		const maxDistanceKm = toMaxDistanceKm(distance);
		const requestedTypes = normalizeRequestedTypes(facilities);

		if (requestedTypes.length === 0) {
			return res.status(400).json({ message: "At least one valid facility type is required" });
		}

		// ✅ SAME SQL — now executed via Supabase RPC
		const sql = `
			SELECT
				id,
				name,
				latitude,
				longitude,
				type,
				ROUND((ST_Distance(
					location,
					ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
				) / 1000)::numeric, 3) AS distance_km
			FROM places
			WHERE location IS NOT NULL
				AND ST_DWithin(
					location,
					ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
					$3 * 1000
				)
				AND (
					COALESCE(array_length($4::text[], 1), 0) = 0
					OR lower(type) = ANY($4::text[])
				)
			ORDER BY distance_km ASC
			LIMIT 1000
		`;

		// 🔥 Supabase raw SQL execution
		const { data, error } = await supabase.rpc("execute_sql", {
			query: sql,
			params: [lon, lat, maxDistanceKm, requestedTypes],
		});

		if (error) throw error;

		if (!data || data.length === 0) {
			return res.json({
				search_radius_km: maxDistanceKm,
				total_amenities_found: 0,
				phase: 0,
				zones: [],
				reason: "No amenities found in the given range",
			});
		}

		const amenityRows = data.map((row) => ({
			id: row.id,
			name: row.name,
			lat: Number(row.latitude),
			lon: Number(row.longitude),
			type: row.type,
			distance_km: Number(row.distance_km),
		}));

		const { phase, zones } = findOptimalZones({
			amenityRows,
			officeLat: lat,
			officeLon: lon,
			requiredTypes: requestedTypes,
			requiredFacilities: facilities,
			topN: Number(top_n) || 3,
		});

		return res.json({
			search_radius_km: maxDistanceKm,
			total_amenities_found: data.length,
			phase,
			zones,
		});

	} catch (error) {
		console.error("Place search error:", error.message);
		return res.status(500).json({ message: "Failed to fetch places" });
	}
};

module.exports = {
	searchPlaces,
};
const { query } = require("../config/db");

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
		const { latitude, longitude, facilities = [], distance = {}, limit = 20 } = req.body;

		const lat = Number(latitude);
		const lon = Number(longitude);

		if (Number.isNaN(lat) || Number.isNaN(lon)) {
			return res.status(400).json({ message: "Valid latitude and longitude are required" });
		}

		const maxDistanceKm = toMaxDistanceKm(distance);
		const requestedTypes = normalizeRequestedTypes(facilities);
		const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);

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
			LIMIT $5
		`;

		const result = await query(sql, [lon, lat, maxDistanceKm, requestedTypes, safeLimit]);

		return res.json({
			count: result.rows.length,
			maxDistanceKm,
			results: result.rows,
		});
	} catch (error) {
		console.error("Place search error:", error.message);
		return res.status(500).json({ message: "Failed to fetch places" });
	}
};

module.exports = {
	searchPlaces,
};

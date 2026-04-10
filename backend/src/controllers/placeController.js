const supabase = require("../config/supabaseClient");
const { findOptimalZones } = require("./findOptimalZones");

// Facility mapping
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

// Distance conversion
const toMaxDistanceKm = (distance) => {
	const value = Number(distance?.value);

	if (!value || value <= 0) return 3;

	if (distance?.unit === "km") return value;

	const speedByModeKmPerMin = {
		walking: 0.083,
		cycling: 0.25,
		driving: 0.67,
	};

	const speed = speedByModeKmPerMin[distance?.travelMode] || speedByModeKmPerMin.walking;

	return Math.max(0.5, value * speed);
};

// Normalize types
const normalizeRequestedTypes = (facilities = []) => {
	const mapped = facilities.flatMap((f) => FACILITY_TYPE_MAP[f] || []);
	return [...new Set(mapped.map((item) => item.toLowerCase()))];
};

const searchPlaces = async (req, res) => {
	try {
		const { latitude, longitude, facilities = [], distance = {}, top_n = 5 } = req.body;
		console.log("Received search request:", { latitude, longitude, facilities, distance, top_n });
		const lat = Number(latitude);
		const lon = Number(longitude);

		if (Number.isNaN(lat) || Number.isNaN(lon)) {
			return res.status(400).json({ message: "Valid latitude and longitude are required" });
		}

		const maxDistanceKm = toMaxDistanceKm(distance) || 5;
		const requestedTypes = normalizeRequestedTypes(facilities);

		if (requestedTypes.length === 0) {
			return res.status(400).json({ message: "At least one valid facility type is required" });
		}

		// 🔥 CALL SUPABASE FUNCTION
		const { data, error } = await supabase.rpc("search_places", {
			lon,
			lat,
			max_distance: maxDistanceKm,
			types: requestedTypes,
		});


		console.log("Supabase returned:", data?.length, "rows");
		console.log("Sample:", data?.slice(0, 3));
		console.log("Query Params:", { lat, lon, maxDistanceKm, requestedTypes });

		if (error) {
			console.error("Supabase Error:", error);
			throw error;
		}

		if (!data || data.length === 0) {
			return res.json({
				search_radius_km: maxDistanceKm,
				total_amenities_found: 0,
				phase: 0,
				zones: [],
				reason: "No amenities found in the given range",
			});
		}

		// Transform data
		const amenityRows = data.map((row) => ({
			id: row.id,
			name: row.name,
			lat: Number(row.latitude),
			lon: Number(row.longitude),
			type: row.type,
			distance_km: Number(row.distance_km),
		}));

		// optimization logic
		const { phase, zones } = findOptimalZones({
			amenityRows,
			officeLat: lat,
			officeLon: lon,
			// requiredTypes: requestedTypes,
			requiredFacilities: facilities,
			topN: Math.max(Number(top_n) || 5, 5),
		});

		return res.json({
			search_radius_km: maxDistanceKm,
			total_amenities_found: data.length,
			phase,
			zones,
		});

	} catch (error) {
		console.error("Place search error:", error);
		return res.status(500).json({ message: "Failed to fetch places from Supabase" });
	}
};

module.exports = {
	searchPlaces,
};
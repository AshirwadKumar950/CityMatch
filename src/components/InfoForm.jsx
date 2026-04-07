// // /*

// // address from map or give manually
// // required facilities options can add as much as they want 
// // let user choose max distance or walking time
// // or driving time to the city center or work place
// // user can assign priority to each of the above factors and then 
// // we can use that to calculate the best match for them
// // can ask for mendatory or optional marks


// // make own lifestyle profile and then we can match them with the city that best suits their lifestyle
// // can think of budget as well then look for those regions that fit their budget and lifestyle
// // environment preferences like green spaces, noise levels, etc safety preferences.


// // walk distance for each facility

// // comparisons of options of regions
// //  */


import React, { useState, useRef, useEffect } from "react";
import DistanceSelector from "./DistanceSelector";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const facilities = [
  { id: "Hospital", icon: "🏥" },
  { id: "School", icon: "🏫" },
  { id: "Mall", icon: "🛍️" },
  { id: "Gym", icon: "🏋️" },
  { id: "Park", icon: "🌳" },
  { id: "Metro Station", icon: "🚇" },
  { id: "Restaurant", icon: "🍽️" },
  { id: "Airport", icon: "✈️" },
  { id: "Office Area", icon: "🏢" },
  { id: "Bus Stop", icon: "🚌" },
  { id: "University", icon: "🎓" },
  { id: "Supermarket", icon: "🛒" },
];

// takes two props location and function to send results back
function InfoForm({ selectedLocation, onResultsChange }) {
  const [location, setLocation] = useState("");// Stores user’s location
  const [selectedFacilities, setSelectedFacilities] = useState([]); // Stores selected facilities (array)
  const [dropdownOpen, setDropdownOpen] = useState(false); // Controls dropdown visibility
  const [focusedInput, setFocusedInput] = useState(false); // Controls input focus state
  const [isLoading, setIsLoading] = useState(false); // Controls loading state
  const [searchError, setSearchError] = useState(""); // Stores search error messages
  const [results, setResults] = useState([]); // Stores search results

  const [distanceData, setDistanceData] = useState({
    value: "",
    unit: "km",
    travelMode: "walking",
  });

  const dropdownRef = useRef(null);

  // Auto update when map is clicked
  useEffect(() => {
    if (selectedLocation) setLocation(selectedLocation);
  }, [selectedLocation]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Inject fonts + keyframe styles once
  // Adds Google Fonts
  // Adds custom CSS animations
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes dropIn {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .info-form-scroll::-webkit-scrollbar { width: 4px; }
      .info-form-scroll::-webkit-scrollbar-track { background: transparent; }
      .info-form-scroll::-webkit-scrollbar-thumb { background: #e0e7ff; border-radius: 4px; }
      .facility-pill:hover { border-color: #6366f1 !important; color: #6366f1 !important; background: #eef2ff !important; }
      .submit-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 28px rgba(99,102,241,0.38) !important; }
      .submit-btn:active { transform: translateY(0px) !important; }
    `;
    document.head.appendChild(style);
  }, []);

  const toggleFacility = (facilityId) => {
    if (selectedFacilities.includes(facilityId)) {
      setSelectedFacilities(selectedFacilities.filter((item) => item !== facilityId));
    } else {
      setSelectedFacilities([...selectedFacilities, facilityId]);
    }
  };

  const parseLocation = (locationText) => {
    const parts = locationText.split(",").map((part) => part.trim());
    if (parts.length !== 2) return null;

    const latitude = Number(parts[0]);
    const longitude = Number(parts[1]);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;

    return { latitude, longitude };
  };

  const handleSubmit = async () => {
    setSearchError("");

    const parsedLocation = parseLocation(location);
    if (!parsedLocation) {
      setSearchError("Please select location from map first.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/places/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: parsedLocation.latitude,
          longitude: parsedLocation.longitude,
          facilities: selectedFacilities,
          distance: distanceData,
          top_n: 3,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch matching places");
      }

      const zones = data.zones || [];
      const hotspots = zones.map(zone => ({
        center: zone.centroid,       // main point
        boundary: zone.polygon,      // region shape
        amenities: zone.amenities,   // optional markers inside
        rank: zone.rank,
        score: zone.score,
      }));
      setResults(hotspots);
      if (typeof onResultsChange === "function") {
        onResultsChange(hotspots);
      }
    } catch (error) {
      setSearchError(error.message || "Unable to fetch matching places");
      setResults([]);
      if (typeof onResultsChange === "function") {
        onResultsChange([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="info-form-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        fontFamily: "'DM Sans', sans-serif",
        background: "linear-gradient(160deg, #f8f7ff 0%, #f0f4ff 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <div style={{
        padding: "26px 28px 18px",
        background: "white",
        borderBottom: "1px solid rgba(99,102,241,0.1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
          <div style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, flexShrink: 0,
          }}>🏠</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.2rem", fontWeight: 700,
            color: "#1e1b4b", margin: 0,
            letterSpacing: "-0.01em",
          }}>
            Property Details
          </h2>
        </div>
        <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, lineHeight: 1.5 }}>
          Set your requirements to discover the best zones.
        </p>
      </div>

      {/* ── Form Body ───────────────────────────────────── */}
      <div style={{
        padding: "22px 28px",
        display: "flex", flexDirection: "column", gap: 22,
      }}>

        {/* Location Input */}
        <div style={{ animation: "fadeUp 0.3s ease both" }}>
          <label style={{
            display: "block", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "#6366f1", marginBottom: 8,
          }}>
            📍 Base Location
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Enter address or click on map…"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setFocusedInput(true)}
              onBlur={() => setFocusedInput(false)}
              style={{
                width: "100%",
                padding: "11px 36px 11px 38px",
                border: focusedInput ? "1.5px solid #6366f1" : "1.5px solid #e5e7eb",
                borderRadius: 10,
                fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
                color: "#1f2937",
                background: "white",
                outline: "none",
                boxShadow: focusedInput
                  ? "0 0 0 3px rgba(99,102,241,0.1)"
                  : "0 1px 4px rgba(0,0,0,0.05)",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxSizing: "border-box",
              }}
            />
            <span style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", fontSize: 14, opacity: 0.45,
            }}>📍</span>
            {location && (
              <button
                onClick={() => setLocation("")}
                style={{
                  position: "absolute", right: 10, top: "50%",
                  transform: "translateY(-50%)",
                  background: "#f3f4f6", border: "none",
                  borderRadius: "50%", width: 20, height: 20,
                  cursor: "pointer", fontSize: 10, color: "#9ca3af",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >✕</button>
            )}
          </div>
          {location && (
            <div style={{
              marginTop: 5, fontSize: 10, color: "#6366f1",
              fontWeight: 500, display: "flex", alignItems: "center", gap: 4,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#6366f1", display: "inline-block",
              }} />
              Location captured from map
            </div>
          )}
        </div>

        {/* Facilities Dropdown */}
        <div style={{ animation: "fadeUp 0.35s ease both", position: "relative", zIndex: 10 }}>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: 8,
          }}>
            <label style={{
              fontSize: 10, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#6366f1",
            }}>
              🏙️ Preferred Facilities
            </label>
            {selectedFacilities.length > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700,
                background: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
                color: "#6366f1",
                padding: "2px 9px", borderRadius: 20,
                border: "1px solid rgba(99,102,241,0.2)",
              }}>
                {selectedFacilities.length} selected
              </span>
            )}
          </div>

          <div ref={dropdownRef} style={{ position: "relative" }}>
            {/* Trigger */}
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                padding: "11px 14px",
                border: dropdownOpen ? "1.5px solid #6366f1" : "1.5px solid #e5e7eb",
                borderRadius: dropdownOpen ? "10px 10px 0 0" : 10,
                cursor: "pointer",
                background: "white",
                fontSize: 13,
                color: selectedFacilities.length > 0 ? "#1f2937" : "#9ca3af",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                boxShadow: dropdownOpen
                  ? "0 0 0 3px rgba(99,102,241,0.1)"
                  : "0 1px 4px rgba(0,0,0,0.05)",
                transition: "all 0.2s",
                userSelect: "none",
              }}
            >
              <span style={{
                overflow: "hidden", textOverflow: "ellipsis",
                whiteSpace: "nowrap", maxWidth: "90%",
              }}>
                {selectedFacilities.length > 0
                  ? selectedFacilities.map((id) => {
                    const f = facilities.find((f) => f.id === id);
                    return f ? `${f.icon} ${f.id}` : id;
                  }).join("  ·  ")
                  : "Select preferred facilities"}
              </span>
              <svg
                width="12" height="8" viewBox="0 0 12 8" fill="none"
                style={{
                  flexShrink: 0, transition: "transform 0.2s",
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <path d="M1 1l5 6 5-6" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Dropdown list */}
            {dropdownOpen && (
              <div style={{
                position: "absolute", zIndex: 1000,
                background: "white",
                border: "1.5px solid #6366f1",
                borderTop: "1px solid #e0e7ff",
                borderRadius: "0 0 10px 10px",
                width: "100%",
                maxHeight: 240, overflowY: "auto",
                boxShadow: "0 8px 24px rgba(99,102,241,0.15)",
                animation: "dropIn 0.18s ease both",
              }}>
                {facilities.map((facility, i) => (
                  <label
                    key={facility.id}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 14px",
                      cursor: "pointer",
                      borderBottom: i < facilities.length - 1 ? "1px solid #f9fafb" : "none",
                      background: selectedFacilities.includes(facility.id)
                        ? "linear-gradient(135deg,#eef2ff,#f5f3ff)"
                        : "transparent",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      if (!selectedFacilities.includes(facility.id))
                        e.currentTarget.style.background = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedFacilities.includes(facility.id))
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {/* Custom styled checkbox */}
                    <div style={{
                      width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                      border: selectedFacilities.includes(facility.id)
                        ? "2px solid #6366f1" : "2px solid #d1d5db",
                      background: selectedFacilities.includes(facility.id) ? "#6366f1" : "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s",
                    }}>
                      {selectedFacilities.includes(facility.id) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    {/* Hidden native checkbox — keeps logic intact */}
                    <input
                      type="checkbox"
                      checked={selectedFacilities.includes(facility.id)}
                      onChange={() => toggleFacility(facility.id)}
                      style={{ display: "none" }}
                    />
                    <span style={{ fontSize: 15 }}>{facility.icon}</span>
                    <span style={{
                      fontSize: 13,
                      fontWeight: selectedFacilities.includes(facility.id) ? 600 : 400,
                      color: selectedFacilities.includes(facility.id) ? "#4f46e5" : "#374151",
                    }}>
                      {facility.id}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Selected pills below dropdown */}
          {selectedFacilities.length > 0 && (
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10,
              animation: "fadeUp 0.2s ease both",
            }}>
              {selectedFacilities.map((id) => {
                const f = facilities.find((f) => f.id === id);
                if (!f) return null;
                return (
                  <span
                    key={id}
                    className="facility-pill"
                    onClick={() => toggleFacility(id)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "4px 10px",
                      background: "white",
                      border: "1.5px solid #e0e7ff",
                      borderRadius: 20, fontSize: 11, fontWeight: 500,
                      color: "#4f46e5", cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {f.icon} {f.id}
                    <span style={{ fontSize: 9, opacity: 0.55, marginLeft: 1 }}>✕</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Distance Selector */}
        <div style={{ animation: "fadeUp 0.4s ease both" }}>
          <label style={{
            display: "block", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "#6366f1", marginBottom: 8,
          }}>
            ⏱ Distance & Travel
          </label>
          <div style={{
            background: "white",
            border: "1.5px solid #e5e7eb",
            borderRadius: 10,
            padding: "14px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <DistanceSelector
              distanceData={distanceData}
              setDistanceData={setDistanceData}
            />
          </div>
        </div>

        {/* Submit */}
        <div style={{ animation: "fadeUp 0.45s ease both", paddingBottom: 10 }}>
          <button
            onClick={handleSubmit}
            className="submit-btn"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "13px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontSize: 14, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.03em",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
              opacity: isLoading ? 0.8 : 1,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {isLoading ? "Finding..." : "Find Best Zones"}
          </button>
        </div>

        {searchError && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 12,
          }}>
            {searchError}
          </div>
        )}

        {results.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 10 }}>
            <h3 style={{ margin: 0, fontSize: 13, color: "#1f2937", fontWeight: 700 }}>
              Top Hotspots ({results.length})
            </h3>
            {results.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Zone Ranking #{item.rank}</div>
                <div style={{ fontSize: 11, color: "#4b5563", marginTop: 3 }}>
                  {item.score !== null ? `Score: ${Number(item.score).toFixed(2)}` : "Weber Fallback Zone"} • Amenities: {item.amenities ? item.amenities.length : 0}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default InfoForm;
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
  { id: "Hospital",      icon: "🏥" },
  { id: "School",        icon: "🏫" },
  { id: "Mall",          icon: "🛍️" },
  { id: "Gym",           icon: "🏋️" },
  { id: "Park",          icon: "🌳" },
  { id: "Metro Station", icon: "🚇" },
  { id: "Restaurant",    icon: "🍽️" },
  { id: "Airport",       icon: "✈️" },
  { id: "Office Area",   icon: "🏢" },
  { id: "Bus Stop",      icon: "🚌" },
  { id: "University",    icon: "🎓" },
  { id: "Supermarket",   icon: "🛒" },
];

const ZONE_COLORS = ["#6366f1", "#10b981", "#f59e0b"];
const ZONE_LABELS = ["#eef2ff", "#d1fae5", "#fef3c7"];
const ZONE_TEXT   = ["#4f46e5", "#065f46", "#92400e"];

export default function InfoForm({ selectedLocation, onResultsChange }) {
  const [location,           setLocation]           = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [dropdownOpen,       setDropdownOpen]       = useState(false);
  const [focusedInput,       setFocusedInput]       = useState(false);
  const [isLoading,          setIsLoading]          = useState(false);
  const [searchError,        setSearchError]        = useState("");
  const [results,            setResults]            = useState([]);
  const [phase,              setPhase]              = useState(null);
  const [totalFound,         setTotalFound]         = useState(0);
  const [hasSearched,        setHasSearched]        = useState(false);

  const [distanceData, setDistanceData] = useState({
    value: "",
    unit: "km",
    travelMode: "walking",
  });

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (selectedLocation) setLocation(selectedLocation);
  }, [selectedLocation]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes dropIn  { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
      @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:translateY(0)} }
      @keyframes spin    { to{transform:rotate(360deg)} }
      .info-form-scroll::-webkit-scrollbar        { width:4px }
      .info-form-scroll::-webkit-scrollbar-track  { background:transparent }
      .info-form-scroll::-webkit-scrollbar-thumb  { background:#e0e7ff;border-radius:4px }
      .facility-pill:hover { border-color:#6366f1!important;color:#6366f1!important;background:#eef2ff!important }
      .submit-btn:hover    { transform:translateY(-2px)!important;box-shadow:0 8px 28px rgba(99,102,241,.38)!important }
      .submit-btn:active   { transform:translateY(0)!important }
      .zone-card:hover     { border-color:#6366f1!important;box-shadow:0 4px 18px rgba(99,102,241,.13)!important }
      .amenity-row:hover   { background:#f9fafb!important }
    `;
    document.head.appendChild(style);
  }, []);

  const toggleFacility = (id) =>
    setSelectedFacilities(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const parseLocation = (text) => {
    const parts = text.split(",").map(p => p.trim());
    if (parts.length !== 2) return null;
    const latitude  = Number(parts[0]);
    const longitude = Number(parts[1]);
    if (isNaN(latitude) || isNaN(longitude)) return null;
    return { latitude, longitude };
  };

  const handleSubmit = async () => {
    setSearchError("");
    const parsedLocation = parseLocation(location);
    if (!parsedLocation) {
      setSearchError("Please select a location from the map first.");
      return;
    }
    if (selectedFacilities.length === 0) {
      setSearchError("Please select at least one facility.");
      return;
    }
    setIsLoading(true);
    setResults([]);
    setPhase(null);
    setHasSearched(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/places/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude:   parsedLocation.latitude,
          longitude:  parsedLocation.longitude,
          facilities: selectedFacilities,
          distance:   distanceData,
          top_n:      3,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to fetch matching places");

      const zones = data.zones || [];
      setPhase(data.phase);
      setTotalFound(data.total_amenities_found || 0);
      setHasSearched(true);

      const hotspots = zones.map(zone => ({
        center:              zone.centroid,
        boundary:            zone.polygon,
        amenities:           zone.amenities || [],
        rank:                zone.rank,
        score:               zone.score,
        facilities_covered:  zone.facilities_covered  || [],
        missing_facilities:  zone.missing_facilities  || [],
        dist_from_office_km: zone.dist_from_office_km,
        amenity_count:       zone.amenity_count,
        phase:               zone.phase,
      }));

      setResults(hotspots);
      if (typeof onResultsChange === "function") onResultsChange(hotspots);
    } catch (err) {
      setSearchError(err.message || "Unable to fetch matching places");
      setResults([]);
      setHasSearched(true);
      if (typeof onResultsChange === "function") onResultsChange([]);
    } finally {
      setIsLoading(false);
    }
  };

  const Label = ({ children }) => (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
      textTransform: "uppercase", color: "#6366f1", marginBottom: 8,
    }}>
      {children}
    </div>
  );

  return (
    <div
      className="info-form-scroll"
      style={{
        height: "100%", overflowY: "auto",
        fontFamily: "'DM Sans', sans-serif",
        background: "linear-gradient(160deg,#f8f7ff 0%,#f0f4ff 100%)",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* ── Header ─────────────────────────────────── */}
      <div style={{
        padding: "24px 28px 16px", background: "white",
        borderBottom: "1px solid rgba(99,102,241,0.1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            borderRadius: 10, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 16, flexShrink: 0,
          }}>🏠</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.18rem", fontWeight: 700,
            color: "#1e1b4b", margin: 0, letterSpacing: "-0.01em",
          }}>
            Property Details
          </h2>
        </div>
        <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, lineHeight: 1.5 }}>
          Set your requirements to discover the best zones.
        </p>
      </div>

      {/* ── Form Body ───────────────────────────────── */}
      <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Location */}
        <div style={{ animation: "fadeUp .3s ease both" }}>
          <Label>📍 Base Location</Label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Enter address or click on map…"
              value={location}
              onChange={e => setLocation(e.target.value)}
              onFocus={() => setFocusedInput(true)}
              onBlur={() => setFocusedInput(false)}
              style={{
                width: "100%", padding: "11px 36px 11px 38px",
                border: focusedInput ? "1.5px solid #6366f1" : "1.5px solid #e5e7eb",
                borderRadius: 10, fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
                color: "#1f2937", background: "white", outline: "none",
                boxShadow: focusedInput ? "0 0 0 3px rgba(99,102,241,.1)" : "0 1px 4px rgba(0,0,0,.05)",
                transition: "border-color .2s,box-shadow .2s",
                boxSizing: "border-box",
              }}
            />
            <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,opacity:.45 }}>📍</span>
            {location && (
              <button onClick={() => setLocation("")} style={{
                position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
                background:"#f3f4f6",border:"none",borderRadius:"50%",
                width:20,height:20,cursor:"pointer",fontSize:10,color:"#9ca3af",
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>✕</button>
            )}
          </div>
          {location && (
            <div style={{ marginTop:5,fontSize:10,color:"#6366f1",fontWeight:500,display:"flex",alignItems:"center",gap:4 }}>
              <span style={{ width:6,height:6,borderRadius:"50%",background:"#6366f1",display:"inline-block" }}/>
              Location captured from map
            </div>
          )}
        </div>

        {/* Facilities Dropdown */}
        <div style={{ animation:"fadeUp .35s ease both",position:"relative",zIndex:10 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8 }}>
            <Label>🏙️ Preferred Facilities</Label>
            {selectedFacilities.length > 0 && (
              <span style={{
                fontSize:10,fontWeight:700,
                background:"linear-gradient(135deg,#eef2ff,#e0e7ff)",
                color:"#6366f1",padding:"2px 9px",borderRadius:20,
                border:"1px solid rgba(99,102,241,.2)",
              }}>
                {selectedFacilities.length} selected
              </span>
            )}
          </div>

          <div ref={dropdownRef} style={{ position:"relative" }}>
            <div
              onClick={() => setDropdownOpen(v => !v)}
              style={{
                padding:"11px 14px",
                border: dropdownOpen ? "1.5px solid #6366f1" : "1.5px solid #e5e7eb",
                borderRadius: dropdownOpen ? "10px 10px 0 0" : 10,
                cursor:"pointer", background:"white", fontSize:13,
                color: selectedFacilities.length > 0 ? "#1f2937" : "#9ca3af",
                display:"flex", alignItems:"center", justifyContent:"space-between",
                boxShadow: dropdownOpen ? "0 0 0 3px rgba(99,102,241,.1)" : "0 1px 4px rgba(0,0,0,.05)",
                transition:"all .2s", userSelect:"none",
              }}
            >
              <span style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"90%" }}>
                {selectedFacilities.length > 0
                  ? selectedFacilities.map(id => {
                      const f = facilities.find(f => f.id === id);
                      return f ? `${f.icon} ${f.id}` : id;
                    }).join("  ·  ")
                  : "Select preferred facilities"}
              </span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none"
                style={{ flexShrink:0,transition:"transform .2s",transform:dropdownOpen?"rotate(180deg)":"rotate(0deg)" }}>
                <path d="M1 1l5 6 5-6" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {dropdownOpen && (
              <div style={{
                position:"absolute",zIndex:1000,background:"white",
                border:"1.5px solid #6366f1",borderTop:"1px solid #e0e7ff",
                borderRadius:"0 0 10px 10px",width:"100%",
                maxHeight:240,overflowY:"auto",
                boxShadow:"0 8px 24px rgba(99,102,241,.15)",
                animation:"dropIn .18s ease both",
              }}>
                {facilities.map((facility, i) => (
                  <label key={facility.id} style={{
                    display:"flex",alignItems:"center",gap:10,padding:"9px 14px",cursor:"pointer",
                    borderBottom: i < facilities.length-1 ? "1px solid #f9fafb" : "none",
                    background: selectedFacilities.includes(facility.id)
                      ? "linear-gradient(135deg,#eef2ff,#f5f3ff)" : "transparent",
                    transition:"background .12s",
                  }}
                  onMouseEnter={e => { if (!selectedFacilities.includes(facility.id)) e.currentTarget.style.background="#f9fafb"; }}
                  onMouseLeave={e => { if (!selectedFacilities.includes(facility.id)) e.currentTarget.style.background="transparent"; }}
                  >
                    <div style={{
                      width:18,height:18,borderRadius:5,flexShrink:0,
                      border: selectedFacilities.includes(facility.id) ? "2px solid #6366f1" : "2px solid #d1d5db",
                      background: selectedFacilities.includes(facility.id) ? "#6366f1" : "white",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      transition:"all .15s",
                    }}>
                      {selectedFacilities.includes(facility.id) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <input type="checkbox" checked={selectedFacilities.includes(facility.id)}
                      onChange={() => toggleFacility(facility.id)} style={{ display:"none" }} />
                    <span style={{ fontSize:15 }}>{facility.icon}</span>
                    <span style={{
                      fontSize:13,
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

          {selectedFacilities.length > 0 && (
            <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginTop:10,animation:"fadeUp .2s ease both" }}>
              {selectedFacilities.map(id => {
                const f = facilities.find(f => f.id === id);
                if (!f) return null;
                return (
                  <span key={id} className="facility-pill" onClick={() => toggleFacility(id)} style={{
                    display:"inline-flex",alignItems:"center",gap:5,
                    padding:"4px 10px",background:"white",
                    border:"1.5px solid #e0e7ff",borderRadius:20,
                    fontSize:11,fontWeight:500,color:"#4f46e5",cursor:"pointer",transition:"all .15s",
                  }}>
                    {f.icon} {f.id}
                    <span style={{ fontSize:9,opacity:.55,marginLeft:1 }}>✕</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Distance Selector */}
        <div style={{ animation:"fadeUp .4s ease both" }}>
          <Label>⏱ Distance & Travel</Label>
          <div style={{
            background:"white",border:"1.5px solid #e5e7eb",
            borderRadius:10,padding:14,
            boxShadow:"0 1px 4px rgba(0,0,0,.05)",
          }}>
            <DistanceSelector distanceData={distanceData} setDistanceData={setDistanceData} />
          </div>
        </div>

        {/* Submit */}
        <div style={{ animation:"fadeUp .45s ease both" }}>
          <button
            onClick={handleSubmit}
            className="submit-btn"
            disabled={isLoading}
            style={{
              width:"100%", padding:13,
              background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
              color:"white", border:"none", borderRadius:12,
              fontSize:14, fontWeight:700,
              fontFamily:"'DM Sans', sans-serif",
              letterSpacing:"0.03em", cursor: isLoading ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow:"0 4px 16px rgba(99,102,241,.3)",
              transition:"transform .2s,box-shadow .2s",
              opacity: isLoading ? 0.8 : 1,
            }}
          >
            {isLoading ? (
              <>
                <span style={{
                  width:14,height:14,borderRadius:"50%",
                  border:"2px solid rgba(255,255,255,.35)",
                  borderTop:"2px solid white",
                  animation:"spin .7s linear infinite",
                  display:"inline-block",flexShrink:0,
                }}/>
                Analysing zones…
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Find Best Zones
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {searchError && (
          <div style={{
            background:"#fef2f2",border:"1px solid #fecaca",
            color:"#b91c1c",borderRadius:10,padding:"10px 12px",fontSize:12,
            display:"flex",alignItems:"flex-start",gap:6,
          }}>
            <span>⚠️</span><span>{searchError}</span>
          </div>
        )}

        {/* ── Results ──────────────────────────────── */}
        {results.length > 0 && (
          <div style={{ display:"flex",flexDirection:"column",gap:12,paddingBottom:16,animation:"fadeUp .3s ease both" }}>

            {/* Summary banner */}
            <div style={{
              background:"linear-gradient(135deg,#eef2ff,#e0e7ff)",
              border:"1px solid rgba(99,102,241,.2)",
              borderRadius:10,padding:"10px 14px",
              display:"flex",alignItems:"center",justifyContent:"space-between",
            }}>
              <div>
                <div style={{ fontSize:12,fontWeight:700,color:"#4f46e5" }}>
                  {results.length} Optimal Zone{results.length !== 1 ? "s" : ""} Found
                </div>
                <div style={{ fontSize:10,color:"#818cf8",marginTop:2 }}>
                  {totalFound} amenities scanned · Phase {phase} result
                </div>
              </div>
              <div style={{
                width:34,height:34,borderRadius:"50%",
                background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,
              }}>🎯</div>
            </div>

            {/* Zone cards */}
            {results.map((zone, idx) => {
              const color     = ZONE_COLORS[idx % ZONE_COLORS.length];
              const bgColor   = ZONE_LABELS[idx % ZONE_LABELS.length];
              const textColor = ZONE_TEXT[idx % ZONE_TEXT.length];
              const total     = (zone.facilities_covered?.length ?? 0) + (zone.missing_facilities?.length ?? 0);

              return (
                <div key={idx} className="zone-card" style={{
                  background:"white",
                  border:`1.5px solid ${color}35`,
                  borderRadius:12,overflow:"hidden",
                  boxShadow:"0 2px 10px rgba(0,0,0,.06)",
                  transition:"border-color .2s,box-shadow .2s",
                }}>
                  {/* Card header */}
                  <div style={{
                    background:`linear-gradient(135deg,${color}18,${color}06)`,
                    borderBottom:`1px solid ${color}22`,
                    padding:"12px 14px",
                    display:"flex",alignItems:"center",justifyContent:"space-between",
                  }}>
                    <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                      <div style={{
                        width:30,height:30,borderRadius:"50%",
                        background:color,flexShrink:0,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        color:"white",fontSize:13,fontWeight:800,
                        boxShadow:`0 3px 8px ${color}55`,
                      }}>
                        {zone.rank}
                      </div>
                      <div>
                        <div style={{ fontSize:13,fontWeight:700,color:"#111827" }}>
                          Zone #{zone.rank}
                        </div>
                        <div style={{ fontSize:10,color:"#6b7280",marginTop:1 }}>
                          {zone.dist_from_office_km != null
                            ? `${zone.dist_from_office_km} km from your pin`
                            : "Distance unavailable"}
                        </div>
                      </div>
                    </div>
                    {zone.score !== null && zone.score !== undefined ? (
                      <div style={{
                        background:bgColor,border:`1px solid ${color}30`,
                        borderRadius:8,padding:"4px 10px",
                        fontSize:11,fontWeight:700,color:textColor,
                      }}>
                        ⭐ {Number(zone.score).toFixed(1)}
                      </div>
                    ) : (
                      <div style={{
                        background:"#f3f4f6",borderRadius:8,
                        padding:"4px 10px",fontSize:10,color:"#6b7280",fontWeight:600,
                      }}>
                        Weber Zone
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div style={{ padding:"12px 14px",display:"flex",flexDirection:"column",gap:10 }}>

                    {/* Facilities covered */}
                    {zone.facilities_covered?.length > 0 && (
                      <div>
                        <div style={{ fontSize:10,fontWeight:700,color:"#059669",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.08em" }}>
                          ✅ Available
                        </div>
                        <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                          {zone.facilities_covered.map(f => {
                            const fac = facilities.find(x => x.id === f);
                            return (
                              <span key={f} style={{
                                display:"inline-flex",alignItems:"center",gap:4,
                                padding:"3px 9px",background:"#d1fae5",
                                border:"1px solid #a7f3d0",
                                borderRadius:20,fontSize:10,fontWeight:600,color:"#065f46",
                              }}>
                                {fac?.icon} {f}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Missing facilities */}
                    {zone.missing_facilities?.length > 0 && (
                      <div>
                        <div style={{ fontSize:10,fontWeight:700,color:"#dc2626",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.08em" }}>
                          ❌ Not in this zone
                        </div>
                        <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                          {zone.missing_facilities.map(f => {
                            const fac = facilities.find(x => x.id === f);
                            return (
                              <span key={f} style={{
                                display:"inline-flex",alignItems:"center",gap:4,
                                padding:"3px 9px",background:"#fef2f2",
                                border:"1px solid #fecaca",
                                borderRadius:20,fontSize:10,fontWeight:600,color:"#991b1b",
                              }}>
                                {fac?.icon} {f}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Stats row */}
                    <div style={{
                      display:"flex",gap:8,paddingTop:6,
                      borderTop:"1px solid #f3f4f6",
                    }}>
                      {[
                        { label:"Amenities", value: zone.amenity_count ?? zone.amenities?.length ?? 0, icon:"📍" },
                        { label:"Coverage",  value: `${zone.facilities_covered?.length ?? 0}/${total}`,  icon:"🎯" },
                        { label:"Distance",  value: zone.dist_from_office_km != null ? `${zone.dist_from_office_km}km` : "—", icon:"📏" },
                      ].map(stat => (
                        <div key={stat.label} style={{
                          flex:1,background:"#f9fafb",borderRadius:8,
                          padding:"7px 6px",textAlign:"center",
                        }}>
                          <div style={{ fontSize:13 }}>{stat.icon}</div>
                          <div style={{ fontSize:12,fontWeight:700,color:"#111827",marginTop:2 }}>{stat.value}</div>
                          <div style={{ fontSize:9,color:"#9ca3af",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:1 }}>{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Amenity list — collapsible */}
                    <AmenityList amenities={zone.amenities} color={color} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && hasSearched && results.length === 0 && (
          <div style={{
            textAlign:"center",padding:"28px 16px",
            background:"white",borderRadius:12,
            border:"1.5px dashed #e5e7eb",
          }}>
            <div style={{ fontSize:30,marginBottom:8 }}>🔍</div>
            <div style={{ fontSize:13,fontWeight:600,color:"#374151" }}>No zones found</div>
            <div style={{ fontSize:11,color:"#9ca3af",marginTop:4,lineHeight:1.6 }}>
              Try expanding your search radius or selecting different facilities.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Collapsible amenity list ────────────────────────────────────────
function AmenityList({ amenities, color }) {
  const [open, setOpen] = useState(false);
  if (!amenities || amenities.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          background:"none",border:"none",cursor:"pointer",
          fontSize:10,fontWeight:700,color,padding:0,
          display:"flex",alignItems:"center",gap:4,
          textTransform:"uppercase",letterSpacing:"0.08em",
          marginBottom: open ? 8 : 0,
        }}
      >
        <span style={{ fontSize:8 }}>{open ? "▲" : "▼"}</span>
        {open ? "Hide" : "Show"} amenities ({amenities.length})
      </button>

      {open && (
        <div style={{
          maxHeight:180,overflowY:"auto",
          border:"1px solid #f3f4f6",borderRadius:8,
          animation:"fadeUp .2s ease both",
        }}>
          {amenities.map((a, i) => (
            <div key={a.id ?? i} className="amenity-row" style={{
              display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"7px 10px",
              borderBottom: i < amenities.length-1 ? "1px solid #f9fafb" : "none",
              transition:"background .12s",
            }}>
              <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:color,flexShrink:0 }}/>
                <span style={{ fontSize:11,color:"#374151",fontWeight:500 }}>{a.name}</span>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:5,flexShrink:0 }}>
                <span style={{
                  fontSize:9,padding:"2px 7px",background:"#f3f4f6",
                  borderRadius:20,color:"#6b7280",fontWeight:600,textTransform:"capitalize",
                }}>
                  {a.type}
                </span>
                <span style={{ fontSize:9,color:"#9ca3af",fontWeight:500 }}>
                  {a.distance_km}km
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
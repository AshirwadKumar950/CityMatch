// import { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";

// function LocationMarker({ position, setPosition, setSelectedLocation }) {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       const newPosition = [lat, lng];

//       setPosition(newPosition);
//       setSelectedLocation(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
//     },
//   });

//   return position ? (
//     <Marker position={position}>
//       <Popup>Selected Location 📍</Popup>
//     </Marker>
//   ) : null;
// }

// function MapComponent({ setSelectedLocation }) {
//   const [position, setPosition] = useState(null);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         const currentPos = [latitude, longitude];
//         setPosition(currentPos);
//         setSelectedLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
//       },
//       (err) => {
//         console.error("Error getting location:", err);
//       }
//     );
//   }, []);

//   if (!position) {
//     return (
//       <div className="h-full flex items-center justify-center">
//         Loading map...
//       </div>
//     );
//   }

//   return (
//     <MapContainer center={position} zoom={13} className="h-full w-full">
//       <TileLayer
//         attribution="&copy; OpenStreetMap contributors"
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       <LocationMarker
//         position={position}
//         setPosition={setPosition}
//         setSelectedLocation={setSelectedLocation}
//       />
//     </MapContainer>
//   );
// }

// export default MapComponent;


import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// ── Fix Leaflet default icon paths ──────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Custom teardrop pin ──────────────────────────────────────────────
const createPinIcon = () =>
  L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:38px;height:46px;filter:drop-shadow(0 6px 14px rgba(99,102,241,0.45))">
        <div style="
          width:38px;height:38px;
          background:linear-gradient(145deg,#6366f1,#8b5cf6);
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:3px solid white;
        "></div>
        <div style="
          position:absolute;top:6px;left:6px;
          width:26px;height:26px;
          background:white;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          font-size:13px;
        ">📍</div>
      </div>
    `,
    iconSize:    [38, 46],
    iconAnchor:  [19, 46],
    popupAnchor: [0, -50],
  });

const createResultIcon = () =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width:20px;height:20px;border-radius:50%;
        background:linear-gradient(135deg,#10b981,#059669);
        border:2px solid white;
        box-shadow:0 4px 10px rgba(5,150,105,0.35);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });

// ── Smooth fly-to on pin change ──────────────────────────────────────
function FlyTo({ position }) {
  const map = useMap();
  const prev = useRef(null);
  useEffect(() => {
    if (position && JSON.stringify(position) !== JSON.stringify(prev.current)) {
      map.flyTo(position, 15, { duration: 1.2, easeLinearity: 0.25 });
      prev.current = position;
    }
  }, [position, map]);
  return null;
}

// ── Click handler + marker ───────────────────────────────────────────
function LocationMarker({ position, setPosition, setSelectedLocation }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setSelectedLocation(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    },
  });

  if (!position) return null;

  return (
    <>
      <Circle
        center={position}
        radius={1500}
        pathOptions={{
          color: "#6366f1", weight: 1.8,
          dashArray: "7 5",
          fillColor: "#6366f1", fillOpacity: 0.06,
        }}
      />
      <Circle
        center={position}
        radius={400}
        pathOptions={{
          color: "#6366f1", weight: 0,
          fillColor: "#6366f1", fillOpacity: 0.1,
        }}
      />
      <Marker position={position} icon={createPinIcon()}>
        <Popup>
          <div style={{ fontFamily: "'DM Sans',sans-serif", minWidth: 160 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#1e1b4b", marginBottom: 6 }}>
              📍 Selected Location
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.7 }}>
              <b style={{ color: "#374151" }}>Lat:</b> {position[0].toFixed(5)}°N<br />
              <b style={{ color: "#374151" }}>Lon:</b> {position[1].toFixed(5)}°E
            </div>
            <div style={{
              marginTop: 8, fontSize: 10,
              background: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
              border: "1px solid rgba(99,102,241,0.25)",
              padding: "5px 9px", borderRadius: 7,
              color: "#6366f1", fontWeight: 600,
            }}>
              ⏱ ~20 min walk radius shown
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
}

// ── Map style options ────────────────────────────────────────────────
const MAP_STYLES = [
  {
    id: "voyager",
    label: "Streets",
    icon: "🗺️",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: "© OpenStreetMap © CARTO",
  },
  {
    id: "light",
    label: "Light",
    icon: "☀️",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: "© OpenStreetMap © CARTO",
  },
  {
    id: "topo",
    label: "Topo",
    icon: "🏔️",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap © OpenTopoMap",
  },
  {
    id: "satellite",
    label: "Satellite",
    icon: "🛰️",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri © OpenStreetMap",
  },
];

// ── Custom zoom buttons (inside map) ────────────────────────────────
function ZoomButtons() {
  const map = useMap();
  return (
    <div style={{
      position: "absolute", top: 16, right: 16, zIndex: 999,
      display: "flex", flexDirection: "column",
      borderRadius: 12, overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    }}>
      {[
        { symbol: "+", fn: () => map.zoomIn(),  title: "Zoom in"  },
        { symbol: "−", fn: () => map.zoomOut(), title: "Zoom out" },
      ].map((b, i) => (
        <button
          key={b.symbol}
          title={b.title}
          onClick={b.fn}
          style={{
            width: 40, height: 40,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
            border: "none",
            borderBottom: i === 0 ? "1px solid #f3f4f6" : "none",
            fontSize: 20, fontWeight: 300, color: "#4b5563",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#eef2ff";
            e.currentTarget.style.color = "#6366f1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.95)";
            e.currentTarget.style.color = "#4b5563";
          }}
        >
          {b.symbol}
        </button>
      ))}
    </div>
  );
}

// ── Recenter button (inside map) ─────────────────────────────────────
function RecenterBtn({ userPos }) {
  const map = useMap();
  if (!userPos) return null;
  return (
    <button
      title="Go to my location"
      onClick={() => map.flyTo(userPos, 15, { duration: 1.2 })}
      style={{
        position: "absolute", top: 112, right: 16, zIndex: 999,
        width: 40, height: 40,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        border: "none", borderRadius: 10,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        fontSize: 17, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.15s, transform 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#eef2ff";
        e.currentTarget.style.transform = "scale(1.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.95)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      🎯
    </button>
  );
}

// ── Main export ──────────────────────────────────────────────────────
export default function MapComponent({ setSelectedLocation, preferredLocations = [] }) {
  const [position,      setPosition]      = useState(null);
  const [userPos,       setUserPos]        = useState(null);
  const [loadingGeo,    setLoadingGeo]     = useState(true);
  const [defaultCenter, setDefaultCenter]  = useState([20.5937, 78.9629]);
  const [activeStyle,   setActiveStyle]    = useState("voyager");
  const [showPicker,    setShowPicker]     = useState(false);
  const [pinCount,      setPinCount]       = useState(0);

  const currentStyle = MAP_STYLES.find((s) => s.id === activeStyle);

  useEffect(() => {
    // Fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);

    // Global styles
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeUp {
        from { opacity:0; transform:translateY(8px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes spin { to { transform:rotate(360deg); } }
      .nestiq-map-wrap .leaflet-container { cursor:crosshair !important; font-family:'DM Sans',sans-serif !important; }
      .nestiq-map-wrap .leaflet-control-zoom { display:none !important; }
      .nestiq-map-wrap .leaflet-control-attribution {
        background:rgba(255,255,255,0.7) !important;
        backdrop-filter:blur(6px) !important;
        font-size:9px !important; color:#9ca3af !important;
        border-radius:6px 0 0 0 !important; padding:3px 7px !important;
      }
      .nestiq-map-wrap .leaflet-popup-content-wrapper {
        border-radius:14px !important;
        box-shadow:0 12px 40px rgba(99,102,241,0.18) !important;
        border:1px solid rgba(99,102,241,0.15) !important;
        padding:0 !important;
      }
      .nestiq-map-wrap .leaflet-popup-content { margin:14px 16px !important; }
      .nestiq-map-wrap .leaflet-popup-tip { background:white !important; }
    `;
    document.head.appendChild(style);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        setDefaultCenter(pos);
        setPosition(pos);
        setUserPos(pos);
        setSelectedLocation(`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
        setLoadingGeo(false);
      },
      () => setLoadingGeo(false)
    );
  }, []);

  const handlePin = (pos) => {
    setPosition(pos);
    setPinCount((c) => c + 1);
  };

  // ── Loading ────────────────────────────────────────────────────────
  if (loadingGeo) {
    return (
      <div style={{
        height: "100%", width: "100%",
        background: "linear-gradient(135deg,#f0f4ff,#faf5ff)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16,
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: "50%",
          border: "3px solid rgba(99,102,241,0.15)",
          borderTop: "3px solid #6366f1",
          animation: "spin 0.85s linear infinite",
        }} />
        <span style={{
          fontSize: 11, color: "#a5b4fc",
          fontFamily: "'DM Sans',sans-serif",
          fontWeight: 600, letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          Locating you…
        </span>
      </div>
    );
  }

  return (
    <div className="nestiq-map-wrap" style={{ height: "100%", width: "100%", position: "relative" }}>

      {/* ── Map canvas ──────────────────────────────────────────── */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          key={activeStyle}
          url={currentStyle.url}
          attribution={currentStyle.attribution}
          maxZoom={19}
        />
        <LocationMarker
          position={position}
          setPosition={handlePin}
          setSelectedLocation={setSelectedLocation}
        />
        {preferredLocations
          .filter((place) => Number.isFinite(Number(place.latitude)) && Number.isFinite(Number(place.longitude)))
          .map((place) => (
            <Marker
              key={`${place.id}-${place.latitude}-${place.longitude}`}
              position={[Number(place.latitude), Number(place.longitude)]}
              icon={createResultIcon()}
            >
              <Popup>
                <div style={{ fontFamily: "'DM Sans',sans-serif", minWidth: 160 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#064e3b", marginBottom: 4 }}>
                    {place.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#4b5563" }}>
                    {place.type}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: "#065f46", fontWeight: 600 }}>
                    Distance: {Number(place.distance_km).toFixed(2)} km
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        <FlyTo position={position} />
        <ZoomButtons />
        <RecenterBtn userPos={userPos} />
      </MapContainer>

      {/* ── Top-left info badge ──────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 16, left: 16, zIndex: 999,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(99,102,241,0.15)",
        borderRadius: 12,
        padding: "10px 14px",
        boxShadow: "0 4px 20px rgba(99,102,241,0.1)",
        fontFamily: "'DM Sans',sans-serif",
        minWidth: 190,
        animation: "fadeUp 0.4s ease both",
      }}>
        {position ? (
          <>
            <div style={{
              fontSize: 9, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#6366f1", marginBottom: 5,
            }}>
              📍 Pin {pinCount > 1 ? `· ${pinCount} drops` : "dropped"}
            </div>
            <div style={{ fontSize: 12, color: "#374151", fontWeight: 500, lineHeight: 1.65 }}>
              {position[0].toFixed(5)}°N<br />{position[1].toFixed(5)}°E
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, flexShrink: 0,
            }}>🖱️</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1e1b4b" }}>
                Click to drop a pin
              </div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>
                Tap anywhere on the map
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom-left: map style switcher ─────────────────────── */}
      <div style={{ position: "absolute", bottom: 24, left: 16, zIndex: 999 }}>

        {/* Picker panel */}
        {showPicker && (
          <div style={{
            marginBottom: 8,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(14px)",
            borderRadius: 12,
            padding: 8,
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
            border: "1px solid rgba(99,102,241,0.12)",
            display: "flex", flexDirection: "column", gap: 3,
            animation: "fadeUp 0.2s ease both",
          }}>
            {MAP_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => { setActiveStyle(s.id); setShowPicker(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 12px", borderRadius: 8, border: "none",
                  background: activeStyle === s.id
                    ? "linear-gradient(135deg,#eef2ff,#e0e7ff)"
                    : "transparent",
                  color: activeStyle === s.id ? "#6366f1" : "#4b5563",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12, fontWeight: activeStyle === s.id ? 600 : 400,
                  cursor: "pointer", whiteSpace: "nowrap",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (activeStyle !== s.id) e.currentTarget.style.background = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  if (activeStyle !== s.id) e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ fontSize: 15 }}>{s.icon}</span>
                {s.label}
                {activeStyle === s.id && (
                  <span style={{
                    marginLeft: "auto", fontSize: 9,
                    background: "#6366f1", color: "white",
                    padding: "2px 7px", borderRadius: 10, fontWeight: 700,
                  }}>✓</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Toggle pill */}
        <button
          onClick={() => setShowPicker((v) => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 14px",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(10px)",
            border: showPicker
              ? "1.5px solid rgba(99,102,241,0.4)"
              : "1px solid rgba(0,0,0,0.08)",
            borderRadius: 10,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 12, fontWeight: 500, color: "#374151",
            transition: "all 0.15s",
          }}
        >
          <span style={{ fontSize: 14 }}>{currentStyle.icon}</span>
          {currentStyle.label}
          <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
            <path
              d={showPicker ? "M1 6l4-5 4 5" : "M1 1l4 5 4-5"}
              stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* ── Bottom-right: walk scale legend ─────────────────────── */}
      <div style={{
        position: "absolute", bottom: 24, right: 66, zIndex: 999,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: 8,
        padding: "6px 12px",
        fontFamily: "'DM Sans',sans-serif",
        fontSize: 10, fontWeight: 600, color: "#6b7280",
        display: "flex", alignItems: "center", gap: 7,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      }}>
        <div style={{
          width: 24, height: 3,
          background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
          borderRadius: 2,
        }} />
        ~1.5 km walk
      </div>

    </div>
  );
}


import { useState } from "react";
import MapComponent from "../components/MapComponent";
import InfoForm from "../components/InfoForm";

function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <div
      className="flex"
      style={{ height: "calc(100vh - 128px)" }}
    >
      <div className="w-1/2 h-full">
        <MapComponent setSelectedLocation={setSelectedLocation} />
      </div>
      <div className="w-1/2 h-full overflow-y-auto bg-gray-100">
        <InfoForm selectedLocation={selectedLocation} />
      </div>
    </div>
  );
}

export default MapPage;
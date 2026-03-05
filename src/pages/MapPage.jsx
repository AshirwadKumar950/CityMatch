import { useState } from "react";
import MapComponent from "../components/MapComponent";
import InfoForm from "../components/InfoForm";

function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <div className="h-screen flex">
      
      {/* Left Side - Map */}
      <div className="w-1/2 h-full">
        <MapComponent setSelectedLocation={setSelectedLocation} />
      </div>

      {/* Right Side - Info Form */}
      <div className="w-1/2 h-full bg-gray-100">
        <InfoForm selectedLocation={selectedLocation} />
      </div>

    </div>
  );
}

export default MapPage;


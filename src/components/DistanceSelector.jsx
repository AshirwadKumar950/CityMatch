import React from "react";

function DistanceSelector({ distanceData, setDistanceData }) {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold text-[oklch(39.4%_0.023_107.4)]">
        Maximum Distance / Time
      </label>

      <div className="flex gap-2">
        {/* Value */}
        <input
          type="number"
          placeholder="Value"
          value={distanceData.value}
          onChange={(e) =>
            setDistanceData({ ...distanceData, value: e.target.value })
          }
          className="border text-white p-2 w-1/3 rounded 
                    bg-[oklch(73.7%_0.021_106.9)] 
                    placeholder-white/70"
        />

        {/* Unit */}
        <select
          value={distanceData.unit}
          onChange={(e) =>
            setDistanceData({ ...distanceData, unit: e.target.value })
          }
          className="border text-white p-2 w-1/3 rounded 
                    bg-[oklch(73.7%_0.021_106.9)] 
                    appearance-none"
        >
          <option value="km" className="text-black">
            Kilometers
          </option>
          <option value="min" className="text-black">
            Minutes
          </option>
        </select>

        {/* Travel Mode */}
        <select
          value={distanceData.travelMode}
          onChange={(e) =>
            setDistanceData({
              ...distanceData,
              travelMode: e.target.value
            })
          }
          className="border text-white p-2 w-1/3 rounded 
                    bg-[oklch(73.7%_0.021_106.9)] 
                    appearance-none"
        >
          <option value="walking" className="text-black">
            Walking
          </option>
          <option value="driving" className="text-black">
            Driving
          </option>
          <option value="cycling" className="text-black">
            Cycling
          </option>
        </select>
      </div>
    </div>
  );
}

export default DistanceSelector;
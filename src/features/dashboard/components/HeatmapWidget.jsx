import React from "react";
import NepalReachMap from "../../analytics/NepalReachMap";

export default function HeatmapWidget({ title, data }) {
  return (
    <div className="w-full">
      <NepalReachMap title={title} customData={data?.regions} />
    </div>
  );
}

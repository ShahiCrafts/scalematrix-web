import React from "react";
import TrendMetricWidget from "./TrendMetricWidget";
import BarChartWidget from "./BarChartWidget";
import HeatmapWidget from "./HeatmapWidget";

import InstagramIcon from "../../../assets/icons/instagram.svg";
import LinkedinIcon from "../../../assets/icons/linkedin.svg";

export default function GenericWidgetContainer({ binding, data, onNavigate }) {
  if (!binding) return null;

  const { widgetDefinitionKey, title, appProviderKey } = binding;

  // Render appropriate visualization based on WidgetDefinition key
  if (widgetDefinitionKey === "trend_metric" || widgetDefinitionKey === "count_metric") {
    return <TrendMetricWidget title={title} data={data} providerKey={appProviderKey} />;
  }

  if (widgetDefinitionKey === "bar_chart" || widgetDefinitionKey === "line_chart") {
    return <BarChartWidget title={title} data={data} onNavigate={onNavigate} />;
  }

  if (widgetDefinitionKey === "heatmap") {
    return <HeatmapWidget title={title} data={data} />;
  }

  // Fallback default
  return <TrendMetricWidget title={title} data={data} providerKey={appProviderKey} />;
}

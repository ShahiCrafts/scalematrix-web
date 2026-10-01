import React from "react";
import { FiArrowUpRight } from "react-icons/fi";

export default function BarChartWidget({ title, data, onNavigate }) {
  const items = data?.items || [];
  const delta = data?.delta || "+14.2%";

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-transparent rounded-2xl p-6 flex flex-col justify-between h-[360px] transition-colors">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-[14px] font-semibold text-neutral-900 dark:text-white">
              {title}
            </h2>
            <p className="text-[12px] text-neutral-500 mt-1">
              Active performance reach over the last 7 days.
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[13px] font-bold text-emerald-400 flex items-center gap-0.5">
              <FiArrowUpRight className="w-3.5 h-3.5" />
              {delta}
            </span>
            <span className="text-[9px] text-neutral-500 mt-0.5">
              vs previous period
            </span>
          </div>
        </div>

        <div className="mt-4 relative">
          <div className="flex items-end justify-between h-40 px-2 relative border-b border-neutral-200 dark:border-neutral-800/80 pb-2">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800/30" />
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800/30" />
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800/30" />
              <div className="w-full" />
            </div>

            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex-1 h-full flex flex-col justify-end items-center group relative z-10"
              >
                <div className="absolute bottom-full mb-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-[10px] font-semibold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl flex flex-col items-center whitespace-nowrap">
                  <span>{item.displayValue || `${item.value} units`}</span>
                  <div className="w-1.5 h-1.5 bg-white dark:bg-neutral-900 border-r border-b border-neutral-200 dark:border-neutral-800 rotate-45 -mb-2 mt-0.5" />
                </div>

                <div
                  className={`w-7 rounded-t-lg transition-all duration-300 ${
                    item.active
                      ? "bg-gradient-to-t from-purple-600 to-indigo-500 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                      : "bg-neutral-200 dark:bg-neutral-800 group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700"
                  }`}
                  style={{
                    height: `${item.value}%`,
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between px-2 mt-2">
            {items.map((d, i) => (
              <span
                key={i}
                className="flex-1 text-center text-[10px] text-neutral-500 font-medium"
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
        <span>Bound Metric: <strong>{title}</strong></span>
        {onNavigate && (
          <span
            className="text-purple-600 dark:text-purple-400 font-semibold cursor-pointer hover:underline"
            onClick={onNavigate}
          >
            View Details
          </span>
        )}
      </div>
    </div>
  );
}

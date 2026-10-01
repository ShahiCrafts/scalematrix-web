import React from "react";
import { FiArrowUpRight, FiArrowDownRight, FiZap, FiUsers, FiTrendingUp, FiMail, FiCheckSquare, FiClock, FiCalendar } from "react-icons/fi";

const ICON_MAP = {
  'zap': FiZap,
  'users': FiUsers,
  'trending-up': FiTrendingUp,
  'mail': FiMail,
  'inbox': FiMail,
  'clock': FiClock,
  'check-square': FiCheckSquare,
  'calendar': FiCalendar,
};

export default function TrendMetricWidget({ title, data, providerKey }) {
  const Icon = ICON_MAP[data?.icon] || FiZap;
  const accent = data?.accent || "bg-purple-500/10";
  const value = data?.value || "—";
  const delta = data?.delta;
  const deltaUp = data?.deltaUp !== false;
  const sub = data?.sub;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-transparent rounded-2xl p-5 flex flex-col gap-2 transition-colors h-full justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-semibold text-neutral-600 dark:text-neutral-400">
          {title}
        </span>
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon className="w-4 h-4 text-purple-400" />
        </span>
      </div>

      <div className="flex items-end gap-2 mt-1">
        <span className="text-2xl font-bold text-neutral-900 dark:text-white leading-none">
          {value}
        </span>
        {delta && (
          <span
            className={`flex items-center gap-0.5 text-[13px] font-semibold mb-0.5 ${
              deltaUp ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {deltaUp ? (
              <FiArrowUpRight className="w-3 h-3" />
            ) : (
              <FiArrowDownRight className="w-3 h-3" />
            )}
            {delta}
          </span>
        )}
      </div>

      {sub && (
        <p className="text-[12px] text-neutral-500 leading-relaxed mt-1">{sub}</p>
      )}
    </div>
  );
}

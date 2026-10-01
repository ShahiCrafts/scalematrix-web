import React from 'react';
import { FiSearch, FiBell, FiSun, FiMoon, FiRefreshCw, FiLoader } from 'react-icons/fi';

export default function SettingsHeader({
  theme,
  toggleTheme,
  isSyncing,
  syncData,
  onOpenNotifications
}) {
  return (
    <header className="w-full px-8 pt-6 pb-6 flex items-center border-b border-neutral-200 dark:border-neutral-800 justify-between z-30 flex-shrink-0 transition-all duration-300 bg-white/70 dark:bg-neutral-950/60 backdrop-blur-md">
      <div>
        <h2 className="text-[18px] font-semibold text-black tracking-tight dark:text-white">
          Settings
        </h2>
        <p className="text-[14px] text-neutral-600 dark:text-neutral-500 mt-0.5">
          Manage your workspace, AI engine, connected accounts and preferences.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Box */}
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search settings..."
            className="bg-[#141418] border border-neutral-800 text-xs text-white placeholder-neutral-500 rounded-full pl-9 pr-4 py-2.5 w-60 focus:outline-none focus:border-purple-600 transition-all"
          />
        </div>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          title="Notifications"
          className="w-9 h-9 rounded-full bg-[#141418] border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
        >
          <FiBell className="w-4 h-4" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title="Switch mode"
          className="w-9 h-9 rounded-full bg-[#141418] border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
        >
          {theme === "dark" ? <FiSun className="w-4 h-4 text-amber-400" /> : <FiMoon className="w-4 h-4 text-purple-400" />}
        </button>

        {/* Sync Button */}
        <button
          onClick={syncData}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141418] border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSyncing ? <FiLoader className="w-3.5 h-3.5 animate-spin" /> : <FiRefreshCw className="w-3.5 h-3.5" />}
          <span>Sync</span>
        </button>
      </div>
    </header>
  );
}

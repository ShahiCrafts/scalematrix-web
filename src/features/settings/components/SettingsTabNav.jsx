import React from 'react';

export default function SettingsTabNav({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex items-center gap-6 border-b border-neutral-800/80 pb-3 overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-2 text-xs font-bold transition-all relative cursor-pointer whitespace-nowrap ${
              isActive ? "text-purple-400" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {isActive && (
              <div className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-purple-600 rounded-full shadow-sm shadow-purple-500/50" />
            )}
          </button>
        );
      })}
    </div>
  );
}

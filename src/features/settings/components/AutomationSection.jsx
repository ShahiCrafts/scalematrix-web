import React from 'react';
import { FiZap } from 'react-icons/fi';

export default function AutomationSection({ automation, setAutomation, showNotification }) {
  const items = [
    { id: "autopilot", label: "Autopilot", desc: "AI content automation." },
    { id: "autoReplies", label: "Auto Replies", desc: "Auto reply to DMs." },
    { id: "smartQueue", label: "Smart Queue", desc: "Optimal time scheduling." },
    { id: "dmToEmail", label: "DM to Email", desc: "Forward DMs to email." }
  ];

  return (
    <div className="bg-[#121215] border border-neutral-800/90 rounded-3xl p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiZap className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-base font-bold text-white">Automation Preferences</h3>
            <p className="text-xs text-neutral-400">Configure autopilot, auto-replies and publishing rules.</p>
          </div>
        </div>

        <button
          onClick={() => showNotification("Automation rules configured")}
          className="px-4 py-2 rounded-full bg-[#181820] border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer"
        >
          Configure
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {items.map((item) => {
          const isChecked = automation[item.id];
          return (
            <div key={item.id} className="bg-[#181820] border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">{item.label}</h4>
                <p className="text-[10px] text-neutral-400">{item.desc}</p>
              </div>
              <button
                onClick={() => setAutomation({ ...automation, [item.id]: !isChecked })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${isChecked ? 'bg-purple-600' : 'bg-neutral-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${isChecked ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

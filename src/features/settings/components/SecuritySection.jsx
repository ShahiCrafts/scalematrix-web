import React from 'react';
import { FiShield, FiLock, FiSmartphone, FiZap, FiMail } from 'react-icons/fi';

export default function SecuritySection({ showNotification }) {
  const securityItems = [
    { icon: FiLock, title: "Password", sub: "Changed 45d ago", color: "text-neutral-400" },
    { icon: FiSmartphone, title: "Two-Factor Auth", sub: "Disabled", color: "text-red-400" },
    { icon: FiZap, title: "Active Sessions", sub: "3 devices", color: "text-emerald-400" },
    { icon: FiMail, title: "Login Alerts", sub: "Email on", color: "text-emerald-400" }
  ];

  return (
    <div className="bg-[#121215] border border-neutral-800/90 rounded-3xl p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiShield className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-base font-bold text-white">Security & Access</h3>
            <p className="text-xs text-neutral-400">Manage your password, sessions and two-factor authentication.</p>
          </div>
        </div>

        <button
          onClick={() => showNotification("Security manager open")}
          className="px-4 py-2 rounded-full bg-[#181820] border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {securityItems.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div key={idx} className="bg-[#181820] border border-neutral-800 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-purple-500/50 transition-all">
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-purple-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">{sec.title}</h4>
                  <p className={`text-[10px] font-medium ${sec.color}`}>{sec.sub}</p>
                </div>
              </div>
              <span className="text-neutral-400 text-xs">›</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

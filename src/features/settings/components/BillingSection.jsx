import React from 'react';
import { FiCreditCard, FiCheck } from 'react-icons/fi';

export default function BillingSection() {
  return (
    <div className="bg-[#121215] border border-neutral-800/90 rounded-3xl p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiCreditCard className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-base font-bold text-white">Billing & Plan</h3>
            <p className="text-xs text-neutral-400">Manage your subscription, plan and usage.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        <div className="bg-[#181820] border border-neutral-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Current Plan</span>
            <h4 className="text-xl font-extrabold text-white mb-1">Free</h4>
            <p className="text-[11px] text-neutral-400">Limited access to core features.</p>
          </div>

          <button
            onClick={() => alert("Upgrade simulation: Upgraded to Pro!")}
            className="px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
          >
            Upgrade to Pro
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <FiCheck className="w-4 h-4 text-emerald-400" />
            <span>Basic Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheck className="w-4 h-4 text-emerald-400" />
            <span>AI Generator (Limited)</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheck className="w-4 h-4 text-emerald-400" />
            <span>Content Studio Access</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheck className="w-4 h-4 text-emerald-400" />
            <span>Autopilot (Limited)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

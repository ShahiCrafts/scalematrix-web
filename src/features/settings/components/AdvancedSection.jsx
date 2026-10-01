import React from 'react';
import { FiDatabase, FiDownload, FiTrash2 } from 'react-icons/fi';

export default function AdvancedSection({ showNotification }) {
  return (
    <div className="bg-[#121215] border border-neutral-800/90 rounded-3xl p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiDatabase className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-base font-bold text-white">Data & Export</h3>
            <p className="text-xs text-neutral-400">Export your data or permanently delete your workspace.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#181820] border border-neutral-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <FiDownload className="w-4 h-4 text-purple-400" />
              Export Workspace Data
            </h4>
            <p className="text-[11px] text-neutral-400 mt-1">Download workspace data in JSON format.</p>
          </div>
          <button
            onClick={() => showNotification("Workspace JSON export started!")}
            className="w-full py-2.5 rounded-xl bg-[#121216] border border-neutral-800 hover:border-purple-500/50 text-xs font-bold text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            Export JSON
          </button>
        </div>

        <div className="bg-[#181820] border border-neutral-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <FiDownload className="w-4 h-4 text-purple-400" />
              Export Analytics Data
            </h4>
            <p className="text-[11px] text-neutral-400 mt-1">Download analytics in CSV format.</p>
          </div>
          <button
            onClick={() => showNotification("Analytics CSV export started!")}
            className="w-full py-2.5 rounded-xl bg-[#121216] border border-neutral-800 hover:border-purple-500/50 text-xs font-bold text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            Export CSV
          </button>
        </div>

        <div className="bg-[#181820] border border-red-500/20 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-red-400 flex items-center gap-2">
              <FiTrash2 className="w-4 h-4 text-red-400" />
              Delete Workspace
            </h4>
            <p className="text-[11px] text-neutral-400 mt-1">Permanently delete workspace and data.</p>
          </div>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to permanently delete your workspace?")) {
                showNotification("Workspace deletion scheduled.", "error");
              }
            }}
            className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-xs font-bold text-red-400 transition-all cursor-pointer"
          >
            Delete Workspace
          </button>
        </div>
      </div>
    </div>
  );
}

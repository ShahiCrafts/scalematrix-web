import React from 'react';
import { FiUser, FiUpload, FiEdit2, FiInfo } from 'react-icons/fi';

export default function GeneralSection({ profile, setProfile, showNotification }) {
  return (
    <div className="space-y-6">
      {/* General Profile Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-neutral-800/60 pb-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <FiUser className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">General Profile</h3>
            <p className="text-xs text-neutral-400">Update your personal details and workspace parameters.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-2">
          {/* Left Profile Avatar Column */}
          <div className="md:col-span-3 flex flex-col items-center gap-3 pt-2">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-indigo-600 flex items-center justify-center text-4xl font-extrabold text-white shadow-2xl shadow-purple-600/30">
                S
              </div>
              <button className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-lg cursor-pointer">
                <FiEdit2 className="w-3.5 h-3.5 text-purple-400" />
              </button>
            </div>

            <button className="w-full py-2.5 px-4 rounded-xl border border-neutral-800 bg-[#16161b] hover:bg-neutral-800 text-xs font-semibold text-purple-400 flex items-center justify-center gap-2 transition-all cursor-pointer">
              <FiUpload className="w-3.5 h-3.5" />
              <span>Change Photo</span>
            </button>

            <p className="text-[10px] text-neutral-500 text-center">JPG, PNG or WEBP<br />Max size 2MB</p>
          </div>

          {/* Right Form Fields Column (Preserving Exact Content Studio Inputs) */}
          <div className="md:col-span-9 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full bg-[#181820] border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-purple-500 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full bg-[#141418] border border-neutral-800/60 rounded-xl py-3 px-4 text-xs text-neutral-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">Role / Industry Title</label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full bg-[#181820] border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-purple-500 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">Company / Brand Name</label>
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  className="w-full bg-[#181820] border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-purple-500 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">Timezone</label>
                <select
                  value={profile.timezone}
                  onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                  className="w-full bg-[#181820] border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="Asia/Kathmandu (GMT+5:45)">Asia/Kathmandu (GMT+5:45)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">System Language</label>
                <select
                  value={profile.language}
                  onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                  className="w-full bg-[#181820] border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="English (UK)">English (UK)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Notice Banner & Save Button Bar */}
        <div className="p-4 rounded-2xl bg-[#16161b] border border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
              <FiInfo className="w-4 h-4" />
            </div>
            <p className="text-xs text-neutral-400">
              These details help personalize your experience across ScaleMatrix. Changes will reflect across the workspace.
            </p>
          </div>

          <button
            onClick={() => showNotification("General profile settings saved!")}
            className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/30 whitespace-nowrap cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

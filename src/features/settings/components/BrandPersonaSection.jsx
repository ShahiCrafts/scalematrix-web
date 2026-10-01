import React from 'react';
import { FiSliders, FiEdit2, FiMic, FiSmile, FiUsers, FiSlash, FiSend } from 'react-icons/fi';

export default function BrandPersonaSection({ showNotification }) {
  const personaItems = [
    { icon: FiMic, title: "Brand Voice", val: "Professional", desc: "Clear, confident and knowledgeable tone." },
    { icon: FiSmile, title: "Tone", val: "Minimal & Clean", desc: "Simple, concise and straightforward." },
    { icon: FiUsers, title: "Target Audience", val: "Marketers & SaaS", desc: "Growth marketers, small business owners and creators." },
    { icon: FiSlash, title: "Avoid", val: "Clickbait, hype", desc: "Overly promotional language and slang." },
    { icon: FiSend, title: "Preferred CTA", val: "Learn more, Try now", desc: "Encourage exploration and product usage." }
  ];

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between border-b border-neutral-800/60 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <FiSliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Brand Persona</h3>
            <p className="text-xs text-neutral-400">Define how ScaleMatrix should represent your brand.</p>
          </div>
        </div>

        <button
          onClick={() => showNotification("Brand Persona editor opened")}
          className="px-4 py-2 rounded-full bg-[#181820] border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
        >
          <FiEdit2 className="w-3.5 h-3.5" />
          <span>Edit Persona</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {personaItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-[#181820] border border-neutral-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Icon className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.title}</span>
              </div>
              <h5 className="text-xs font-bold text-purple-400 truncate">{item.val}</h5>
              <p className="text-[11px] text-neutral-400 leading-tight">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

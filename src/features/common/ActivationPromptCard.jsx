import React, { useState } from 'react';
import { FiZap, FiX, FiCheck, FiArrowRight } from 'react-icons/fi';
import { apiCall } from '../../shared/utils/api';

const curatedApps = [
  { id: 'gmail', name: 'Gmail', icon: '📧', category: 'Productivity' },
  { id: 'github', name: 'GitHub', icon: '🐙', category: 'Dev Tools' },
  { id: 'googlecalendar', name: 'Google Calendar', icon: '📅', category: 'Calendar' },
  { id: 'notion', name: 'Notion', icon: '📝', category: 'Notes' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', category: 'Social' },
  { id: 'instagram', name: 'Instagram', icon: '📸', category: 'Social' },
];

export default function ActivationPromptCard({ onConnectSuccess, setActiveView }) {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('scalematrix_activation_dismissed') === 'true'
  );
  const [connectingApp, setConnectingApp] = useState('');

  if (dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem('scalematrix_activation_dismissed', 'true');
    setDismissed(true);
  };

  const handleConnect = async (appId) => {
    setConnectingApp(appId);
    try {
      const res = await apiCall('/integrations/connect', {
        method: 'POST',
        body: JSON.stringify({ appKey: appId }),
      });
      if (res.data?.redirectUrl && !res.data.redirectUrl.includes('/settings')) {
        window.open(res.data.redirectUrl, '_blank');
      } else {
        if (setActiveView) setActiveView('settings');
      }
      if (onConnectSuccess) onConnectSuccess(appId);
    } catch (err) {
      console.error('Failed to connect app:', err.message);
      if (setActiveView) setActiveView('settings');
    } finally {
      setConnectingApp('');
    }
  };

  return (
    <div className="mb-6 w-full bg-gradient-to-r from-purple-900/40 via-purple-950/20 to-neutral-900/60 border border-purple-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-sm">
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        title="Dismiss suggestion"
      >
        <FiX className="w-4 h-4" />
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-600/20 text-purple-400">
              <FiZap className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white tracking-tight">Unlock 500+ Automations</h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Connect Gmail, GitHub, or Notion to ScaleMatrix to enable automated tool-calling across your workflows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
          {curatedApps.slice(0, 4).map((app) => (
            <button
              key={app.id}
              onClick={() => handleConnect(app.id)}
              disabled={Boolean(connectingApp)}
              className="px-3 py-1.5 rounded-xl bg-neutral-800/90 hover:bg-purple-600/30 border border-neutral-700/60 hover:border-purple-500/50 text-xs font-semibold text-neutral-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{app.icon}</span>
              <span>{app.name}</span>
            </button>
          ))}

          {setActiveView && (
            <button
              onClick={() => setActiveView('settings')}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer ml-1"
            >
              <span>Browse 500+ Apps</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

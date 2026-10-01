import React, { useState } from 'react';
import { 
  FiZap, 
  FiCheck, 
  FiLoader,
  FiArrowRight,
  FiPlus,
  FiCheckCircle
} from 'react-icons/fi';
import { apiCall } from '../../shared/utils/api';
import { Toast } from '../../shared/components';

const availableProviders = [
  { id: 'gmail', name: 'Gmail', icon: '📧', category: 'Productivity' },
  { id: 'jira', name: 'Jira', icon: '🔷', category: 'Project Management' },
  { id: 'figma', name: 'Figma', icon: '🎨', category: 'Design' },
  { id: 'instagram', name: 'Instagram', icon: '📸', category: 'Social Media' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', category: 'Social Media' },
  { id: 'github', name: 'GitHub', icon: '🐙', category: 'Developer Tools' },
];

export default function OnboardingWizard({ initialUser, onComplete }) {
  const [selectedProvider, setSelectedProvider] = useState('gmail');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleActivate = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await apiCall('/onboarding/activate', {
        method: 'POST',
        body: JSON.stringify({
          providerId: selectedProvider,
          accountName: `${selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)} Account`,
        }),
      });

      if (onComplete) {
        onComplete(res?.data?.workspace || { isOnboarded: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to activate workspace. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md text-white flex items-center justify-center p-4 sm:p-6 font-sans">
      <Toast message={errorMessage} type="error" onClose={() => setErrorMessage('')} />

      <div className="w-full max-w-xl bg-[#141419] border border-neutral-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-neutral-800/80 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <FiZap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Connect your first app</h2>
            <p className="text-xs text-neutral-400">ScaleMatrix automates workflows across 500+ tools</p>
          </div>
        </div>

        {/* Integration Selection Grid */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-neutral-300">Select an integration to activate</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableProviders.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => setSelectedProvider(provider.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedProvider === provider.id
                    ? 'bg-purple-600/10 border-purple-500 text-white shadow-md'
                    : 'bg-[#1b1b22] border-neutral-800 hover:border-neutral-700 text-neutral-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-2xl">{provider.icon}</span>
                  {selectedProvider === provider.id && <FiCheck className="w-4 h-4 text-purple-400" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold">{provider.name}</h4>
                  <span className="text-[10px] text-neutral-500">{provider.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleActivate}
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 disabled:opacity-50"
          >
            {loading ? (
              <FiLoader className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Connect {availableProviders.find(p => p.id === selectedProvider)?.name} & Launch</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

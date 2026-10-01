import React, { useState, useEffect } from 'react';
import { FiShare2, FiInstagram, FiFacebook, FiLinkedin, FiTwitter, FiZap, FiLoader } from 'react-icons/fi';
import { socialApi } from '../socialApi';

export default function SocialAccountsSection({ showNotification }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectingProvider, setConnectingProvider] = useState(null);

  // Fetch connected social accounts from backend
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await socialApi.getConnectedAccounts();
      if (response?.data) {
        setAccounts(response.data);
      }
    } catch (err) {
      console.warn("Could not fetch connected accounts:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Initiate OAuth authorization flow via backend gateway
  const handleConnectProvider = async (provider = 'meta', channel = 'instagram') => {
    setConnectingProvider(`${provider}_${channel}`);
    try {
      const res = await socialApi.getAuthUrl(provider, channel);
      if (res?.data?.authUrl) {
        window.location.href = res.data.authUrl;
      }
    } catch (err) {
      showNotification(`Connection failed: ${err.message}`, 'error');
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleDisconnect = async (accountId, accountName) => {
    if (!confirm(`Disconnect social account '${accountName}'?`)) return;
    try {
      await socialApi.disconnectAccount(accountId);
      showNotification(`Disconnected ${accountName}`, 'success');
      fetchAccounts();
    } catch (err) {
      showNotification(`Disconnect failed: ${err.message}`, 'error');
    }
  };

  const isIgConnected = accounts.some(a => a.accountType.includes('instagram'));
  const isFbConnected = accounts.some(a => a.accountType === 'facebook_page');

  return (
    <div className="bg-[#121215] border border-neutral-800/90 rounded-3xl p-8 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiShare2 className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-base font-bold text-white">Social Accounts</h3>
            <p className="text-xs text-neutral-400">Connect your channels for multi-platform AI scheduling & analytics.</p>
          </div>
        </div>

        <button
          onClick={fetchAccounts}
          className="px-4 py-2 rounded-full bg-[#181820] border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
        >
          {loading && <FiLoader className="w-3 h-3 animate-spin" />}
          <span>Sync Accounts</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Instagram */}
        <div className="bg-[#181820] border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <FiInstagram className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Instagram</h4>
                <span className={`text-[10px] font-semibold ${isIgConnected ? 'text-emerald-400' : 'text-neutral-500'}`}>
                  {isIgConnected ? '● Connected' : 'Not Connected'}
                </span>
              </div>
            </div>
          </div>

          {isIgConnected ? (
            <button
              onClick={() => {
                const igAccount = accounts.find(a => a.accountType.includes('instagram'));
                if (igAccount) handleDisconnect(igAccount._id, igAccount.name);
              }}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => handleConnectProvider('meta', 'instagram')}
              disabled={connectingProvider === 'meta_instagram'}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold hover:from-purple-500 hover:to-fuchsia-500 transition-all cursor-pointer disabled:opacity-50"
            >
              {connectingProvider === 'meta_instagram' ? 'Connecting...' : 'Connect'}
            </button>
          )}
        </div>

        {/* Facebook */}
        <div className="bg-[#181820] border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <FiFacebook className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Facebook</h4>
                <span className={`text-[10px] font-semibold ${isFbConnected ? 'text-emerald-400' : 'text-neutral-500'}`}>
                  {isFbConnected ? '● Connected' : 'Not Connected'}
                </span>
              </div>
            </div>
          </div>

          {isFbConnected ? (
            <button
              onClick={() => {
                const fbAccount = accounts.find(a => a.accountType === 'facebook_page');
                if (fbAccount) handleDisconnect(fbAccount._id, fbAccount.name);
              }}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => handleConnectProvider('meta', 'facebook')}
              disabled={connectingProvider === 'meta_facebook'}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-[#121216] border border-neutral-800 hover:border-purple-500/50 text-neutral-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              {connectingProvider === 'meta_facebook' ? 'Connecting...' : 'Connect'}
            </button>
          )}
        </div>

        {/* LinkedIn */}
        <div className="bg-[#181820] border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <FiLinkedin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">LinkedIn</h4>
                <span className="text-[10px] font-semibold text-neutral-500">Supported</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleConnectProvider('linkedin', 'linkedin')}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-[#121216] border border-neutral-800 hover:border-purple-500/50 text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            Connect
          </button>
        </div>

        {/* X Twitter */}
        <div className="bg-[#181820] border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-neutral-700/30 text-white flex items-center justify-center">
                <FiTwitter className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">X (Twitter)</h4>
                <span className="text-[10px] font-semibold text-neutral-500">Supported</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleConnectProvider('twitter', 'twitter')}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-[#121216] border border-neutral-800 hover:border-purple-500/50 text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            Connect
          </button>
        </div>

        {/* TikTok */}
        <div className="bg-[#181820] border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center">
                <FiZap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">TikTok</h4>
                <span className="text-[10px] font-semibold text-neutral-500">Supported</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleConnectProvider('tiktok', 'tiktok')}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-[#121216] border border-neutral-800 hover:border-purple-500/50 text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}

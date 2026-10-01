import React, { useState, useEffect, useRef } from 'react';
import { 
  FiSearch, 
  FiCheckCircle, 
  FiExternalLink, 
  FiRefreshCw, 
  FiLoader,
  FiZap,
  FiTrash2
} from 'react-icons/fi';
import { apiCall } from '../../../shared/utils/api';

/**
 * Layout-matching Skeleton Loader for Integrations Grid
 */
function IntegrationSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-sans">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-[#121215] border border-neutral-800/80 flex flex-col justify-between space-y-4 animate-pulse"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-800" />
              <div className="space-y-1.5">
                <div className="w-24 h-4 rounded bg-neutral-800" />
                <div className="w-16 h-3 rounded bg-neutral-800/60" />
              </div>
            </div>
            <div className="w-12 h-4 rounded-full bg-neutral-800" />
          </div>

          <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between">
            <div className="w-20 h-3 rounded bg-neutral-800/60" />
            <div className="w-16 h-7 rounded-xl bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function IntegrationsSection({ showNotification }) {
  const [catalog, setCatalog] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectingKey, setConnectingKey] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const pollTimerRef = useRef(null);

  const fetchConnectionsOnly = async () => {
    try {
      const connRes = await apiCall('/integrations/connections');
      if (connRes.data) {
        setConnections(connRes.data);
      }
    } catch (err) {
      console.warn('Error re-fetching connections status:', err.message);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, connRes] = await Promise.all([
        apiCall('/integrations/catalog'),
        apiCall('/integrations/connections'),
      ]);
      setCatalog(catRes.data || []);
      setConnections(connRes.data || []);
    } catch (err) {
      console.error('Error loading Composio integrations:', err.message);
      if (showNotification) showNotification('Failed to load integrations catalog', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  const categories = ['All', ...new Set(catalog.map((c) => c.category || 'General'))];

  const filteredCatalog = catalog.filter((app) => {
    const matchesCategory = selectedCategory === 'All' || (app.category || 'General') === selectedCategory;
    const matchesSearch = app.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.composioAppKey.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isConnected = (composioAppKey) => {
    return connections.find(
      (c) => c.appProviderKey?.toLowerCase() === composioAppKey.toLowerCase() && c.status === 'ACTIVE'
    );
  };

  const handleConnect = async (appKey) => {
    setConnectingKey(appKey);
    try {
      const res = await apiCall('/integrations/connect', {
        method: 'POST',
        body: JSON.stringify({ appKey }),
      });

      if (res.data?.redirectUrl) {
        const popup = window.open(res.data.redirectUrl, '_blank', 'width=600,height=700');
        if (showNotification) showNotification(`Opening Composio authorization for ${appKey}...`);

        // Monitor popup window close & start short polling loop for real-time status update
        if (popup) {
          const popupCheckTimer = setInterval(async () => {
            if (popup.closed) {
              clearInterval(popupCheckTimer);
              if (showNotification) showNotification(`Syncing connection status for ${appKey}...`);
              await fetchConnectionsOnly();
              setConnectingKey('');
            }
          }, 1000);
        }

        // Periodic 3s status polling for up to 30s
        let pollCount = 0;
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        pollTimerRef.current = setInterval(async () => {
          pollCount += 1;
          await fetchConnectionsOnly();
          if (pollCount >= 10) {
            clearInterval(pollTimerRef.current);
            setConnectingKey('');
          }
        }, 3000);
      } else {
        if (showNotification) showNotification(`Activated ${appKey} successfully!`);
        await fetchConnectionsOnly();
        setConnectingKey('');
      }
    } catch (err) {
      if (showNotification) showNotification(err.message || 'Failed to initiate connection', 'error');
      setConnectingKey('');
    }
  };

  const handleDisconnect = async (appKey) => {
    if (!window.confirm(`Are you sure you want to disconnect ${appKey}?`)) return;
    setConnectingKey(appKey);
    try {
      await apiCall('/integrations/disconnect', {
        method: 'POST',
        body: JSON.stringify({ appKey }),
      });
      if (showNotification) showNotification(`Disconnected ${appKey} successfully!`, 'success');
      await fetchConnectionsOnly();
    } catch (err) {
      if (showNotification) showNotification(err.message || 'Failed to disconnect integration', 'error');
    } finally {
      setConnectingKey('');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#121215] border border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-600/20 text-purple-400">
              <FiZap className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">Composio Integrations Catalog</h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Connect your active workspace integrations. OAuth handshakes, token vaulting, and execution are managed via Composio.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-3 text-neutral-500 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search integrations (Gmail, Notion, Slack...)..."
            className="w-full bg-[#121215] border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#121215] border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid with Layout-Matching Skeleton */}
      {loading ? (
        <IntegrationSkeletonGrid />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCatalog.map((app) => {
            const conn = isConnected(app.composioAppKey);
            const isNoAuth = app.isNoAuth;

            return (
              <div
                key={app.composioAppKey}
                className="p-5 rounded-2xl bg-[#121215] border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {app.iconUrl ? (
                      <img src={app.iconUrl} alt={app.displayName} className="w-9 h-9 object-contain rounded-lg" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-sm font-bold text-neutral-300">
                        {app.displayName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">{app.displayName}</h4>
                      <span className="text-[10px] text-neutral-500">{app.category || 'General'}</span>
                    </div>
                  </div>

                  {conn && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <FiCheckCircle className="w-3 h-3" />
                      Active
                    </span>
                  )}
                  {isNoAuth && !conn && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      Built-in
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between">
                  {isNoAuth ? (
                    <span className="text-xs text-neutral-400 font-medium">Ready to use</span>
                  ) : conn ? (
                    <span className="text-[11px] text-neutral-400 truncate max-w-[140px]">
                      {conn.accountLabel || 'Connected'}
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-500">Requires Auth</span>
                  )}

                  {!isNoAuth && (
                    <div className="flex items-center gap-1.5">
                      {conn && (
                        <button
                          onClick={() => handleDisconnect(app.composioAppKey)}
                          disabled={Boolean(connectingKey)}
                          title="Disconnect integration"
                          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-800/60 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          <span>Disconnect</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleConnect(app.composioAppKey)}
                        disabled={Boolean(connectingKey)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          conn
                            ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                        }`}
                      >
                        {connectingKey === app.composioAppKey ? (
                          <FiLoader className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <span>{conn ? 'Reconnect' : 'Connect'}</span>
                            <FiExternalLink className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

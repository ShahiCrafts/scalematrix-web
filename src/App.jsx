import React, { useState, useEffect } from "react";
import { Sidebar, NotificationsDrawer } from "./shared/components";
import { ThemeProvider } from "./shared/context/ThemeContext";
import {
  Home,
  StrategyConsole,
  Planner,
  Studio,
  Advisor,
  Settings,
  AuthPage,
  OnboardingWizard,
  WorkspaceOnboarding,
  Search,
  Analytics,
  Schedule,
} from "./features";
import { apiCall } from "./shared/utils/api";
import {
  getOnboardingStatus,
  setOnboardingStatus,
  getSettings,
  saveSettings,
  getScriptHistory,
  saveScriptHistory,
} from "./shared/utils";
import { DEFAULT_METRICS } from "./shared/constants";

export default function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("scalematrix_access_token")
  );
  const [currentUser, setCurrentUser] = useState(null);
  const [hasWorkspaceSetup, setHasWorkspaceSetup] = useState(false);
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);

  // Handle global unauthorized session invalidation
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setHasWorkspaceSetup(false);
      localStorage.removeItem("scalematrix_access_token");
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  // Check workspace setup status when authenticated
  useEffect(() => {
    async function checkSetupStatus() {
      if (!isAuthenticated) {
        setIsCheckingSetup(false);
        return;
      }
      setIsCheckingSetup(true);
      try {
        const [meRes, connRes] = await Promise.all([
          apiCall("/auth/me"),
          apiCall("/integrations/connections").catch(() => ({ data: [] })),
        ]);
        if (meRes.data?.user) {
          setCurrentUser(meRes.data.user);
          setHasWorkspaceSetup(Boolean(meRes.data.user.hasCompletedWorkspaceSetup));
        } else {
          throw new Error("Invalid user session");
        }
        const connections = connRes.data || [];
        const isIgConnected = connections.some(
          (c) => c.appProviderKey?.toLowerCase() === "instagram" && c.status === "ACTIVE"
        );
        setInstagramConnected(isIgConnected);
      } catch (err) {
        console.warn("Failed to fetch user auth profile or connections:", err.message);
        localStorage.removeItem("scalematrix_access_token");
        setIsAuthenticated(false);
        setCurrentUser(null);
        setHasWorkspaceSetup(false);
      } finally {
        setIsCheckingSetup(false);
      }
    }
    checkSetupStatus();
  }, [isAuthenticated]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Mock connection states
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Settings
  const [settings, setSettings] = useState(() => getSettings());

  // Mock data states
  const [mediaPosts, setMediaPosts] = useState([]);
  const [igInsights, setIgInsights] = useState(null);
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);

  const [topic, setTopic] = useState("");
  const [generatedScript, setGeneratedScript] = useState("");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptHistory, setScriptHistory] = useState(() => getScriptHistory());

  const [sharedCaption, setSharedCaption] = useState("");
  const [sharedMediaUrl, setSharedMediaUrl] = useState("");

  // Sync script history to localStorage when changed
  useEffect(() => {
    saveScriptHistory(scriptHistory);
  }, [scriptHistory]);

  // Save settings helper
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Handle post-OAuth redirect detection on mount
  useEffect(() => {
    if (window.location.search.includes("status=") || window.location.pathname.includes("callback")) {
      syncData();
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Real sync workspace data
  const syncData = async () => {
    setIsSyncing(true);
    try {
      const res = await apiCall("/integrations/connections");
      const connections = res.data || [];
      const isIgConnected = connections.some(
        (c) => c.appProviderKey?.toLowerCase() === "instagram" && c.status === "ACTIVE"
      );
      setInstagramConnected(isIgConnected);
      window.dispatchEvent(new CustomEvent("dashboard:refetchLayout"));
    } catch (err) {
      console.error("Error syncing workspace data:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Mock script generation
  const triggerGenerateScript = async (params) => {
    setIsGeneratingScript(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockScript = `
        [Scene 1] 
        Visual: Eye-catching intro with your brand colors
        Voiceover: "Discover how ${params.topic} can transform your business"
        
        [Scene 2]
        Visual: Key benefits carousel
        Voiceover: "We help you grow faster, smarter, and more sustainably"
        
        [Scene 3]
        Visual: Social proof/testimonials
        Voiceover: "Join thousands of satisfied customers"
        
        [Call to Action]
        Visual: Brand logo with CTA button
        Voiceover: "Click the link in bio to get started today"
      `;
      
      setGeneratedScript(mockScript);

      const newHistoryItem = {
        id: `gen-${Date.now()}`,
        topic: params.topic,
        contentType: params.format?.includes("Carousel") ? "carousel" : "video",
        tone: params.tone,
        duration: params.duration || "30-45 seconds",
        additionalNotes: params.additionalNotes || "",
        date: new Date().toISOString(),
        script: mockScript,
      };
      setScriptHistory((prev) => [newHistoryItem, ...prev]);
    } catch (err) {
      console.error("Script generation failed:", err);
      alert(`Script generation failed:\n${err.message}`);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Real Instagram connect via Composio
  const connectInstagram = async () => {
    setIsConnecting(true);
    setAuthError("");
    try {
      const res = await apiCall("/integrations/connect", "POST", { appKey: "instagram" });
      if (res.data?.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      } else {
        throw new Error("Failed to generate connection link");
      }
    } catch (err) {
      console.error("Connection failed:", err);
      setAuthError(err.message);
      alert(`Connection failed: ${err.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  // Mock Instagram disconnect
  const disconnectInstagram = async () => {
    const confirm = window.confirm(
      "Are you sure you want to remove this Instagram integration?"
    );
    if (!confirm) return;

    try {
      setInstagramConnected(false);
      setUsername("");
      setMediaPosts([]);
      alert("Instagram account disconnected successfully.");
    } catch (err) {
      alert(`Disconnect failed: ${err.message}`);
    }
  };

  // Sync data on mount and when settings change
  useEffect(() => {
    syncData();

    const handleFocus = () => {
      syncData();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <ThemeProvider>
      {!isAuthenticated ? (
        <AuthPage
          onAuthenticated={(user) => {
            setIsAuthenticated(true);
            setCurrentUser(user);
          }}
        />
      ) : isCheckingSetup ? (
        <div className="flex h-screen bg-[#09090b] text-white items-center justify-center font-sans">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-neutral-400 font-medium">Checking workspace setup status...</p>
          </div>
        </div>
      ) : !hasWorkspaceSetup ? (
        <WorkspaceOnboarding
          user={currentUser}
          onComplete={(workspace) => {
            setHasWorkspaceSetup(true);
            syncData();
          }}
        />
      ) : (
        <div className="flex h-screen bg-[#FAFCFF] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-200 overflow-hidden font-sans w-full select-none transition-colors duration-200">

          {/* Sidebar navigation */}
          <Sidebar
            activeView={activeView}
            setActiveView={setActiveView}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            isNotificationsOpen={isNotificationsOpen}
          />

          {/* Notifications Drawer */}
          <NotificationsDrawer
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />

          {/* Main dashboard content */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* View Switcher Container */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {activeView === "dashboard" && (
                <Home
                  metrics={metrics}
                  settings={settings}
                  setActiveView={setActiveView}
                  setTopicForScript={setTopic}
                  instagramConnected={instagramConnected}
                  username={username}
                  connectInstagram={connectInstagram}
                  disconnectInstagram={disconnectInstagram}
                  isConnecting={isConnecting}
                  ollamaConnected={ollamaConnected}
                  isSyncing={isSyncing}
                  syncData={syncData}
                  mediaPosts={mediaPosts}
                  igInsights={igInsights}
                  onOpenNotifications={() => setIsNotificationsOpen(true)}
                  isNotificationsOpen={isNotificationsOpen}
                />
              )}

              {activeView === "strategy" && <StrategyConsole settings={settings} />}

              {activeView === "planner" && (
                <Planner
                  settings={settings}
                  setActiveView={setActiveView}
                  setSharedMediaUrl={setSharedMediaUrl}
                  setSharedCaption={setSharedCaption}
                />
              )}

              {activeView === "studio" && (
                <Studio
                  topic={topic}
                  setTopic={setTopic}
                  generatedScript={generatedScript}
                  setGeneratedScript={setGeneratedScript}
                  isGeneratingScript={isGeneratingScript}
                  triggerGenerateScript={triggerGenerateScript}
                  settings={settings}
                  setSharedCaption={setSharedCaption}
                  setSharedMediaUrl={setSharedMediaUrl}
                  setActiveView={setActiveView}
                  scriptHistory={scriptHistory}
                  setScriptHistory={setScriptHistory}
                />
              )}

              {activeView === "advisor" && (
                <Advisor
                  settings={settings}
                  metrics={metrics}
                  setActiveView={setActiveView}
                  setTopicForScript={setTopic}
                />
              )}

              {activeView === "settings" && (
                <Settings
                  settings={settings}
                  setSettings={handleSaveSettings}
                  instagramConnected={instagramConnected}
                  username={username}
                  authError={authError}
                  connectInstagram={connectInstagram}
                  disconnectInstagram={disconnectInstagram}
                  isConnecting={isConnecting}
                  onOpenNotifications={() => setIsNotificationsOpen(true)}
                  isNotificationsOpen={isNotificationsOpen}
                  isSyncing={isSyncing}
                  syncData={syncData}
                />
              )}

              {activeView === "search" && <Search setActiveView={setActiveView} />}
              {activeView === "analytics" && (
                <Analytics setActiveView={setActiveView} />
              )}
              {activeView === "schedule" && (
                <Schedule setActiveView={setActiveView} />
              )}
            </div>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}

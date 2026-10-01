import React, { useState } from "react";
import { useTheme } from "../../shared/context/ThemeContext";
import {
  FiUser,
  FiCpu,
  FiShare2,
  FiSliders,
  FiShield,
  FiCreditCard,
  FiSettings as FiGear
} from "react-icons/fi";
import { Toast } from "../../shared/components";

import SettingsHeader from "./components/SettingsHeader";
import SettingsTabNav from "./components/SettingsTabNav";
import GeneralSection from "./components/GeneralSection";
import BrandPersonaSection from "./components/BrandPersonaSection";
import AiEngineSection from "./components/AiEngineSection";
import SocialAccountsSection from "./components/SocialAccountsSection";
import IntegrationsSection from "./components/IntegrationsSection";
import AutomationSection from "./components/AutomationSection";
import SecuritySection from "./components/SecuritySection";
import BillingSection from "./components/BillingSection";
import AdvancedSection from "./components/AdvancedSection";

export default function Settings({
  settings,
  setSettings,
  instagramConnected,
  username,
  authError,
  connectInstagram,
  disconnectInstagram,
  isConnecting,
  onOpenNotifications,
  isNotificationsOpen,
  isSyncing,
  syncData,
}) {
  const { theme, toggleTheme } = useTheme();
  const [activeTopTab, setActiveTopTab] = useState("general");
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  // Form States
  const [profile, setProfile] = useState({
    fullName: "Saugat Shahi",
    email: "dev.shahi.apps@gmail.com",
    role: "Growth Marketer & Content Creator",
    company: "ScaleMatrix AI Labs",
    timezone: "Asia/Kathmandu (GMT+5:45)",
    language: "English (US)",
  });

  const [aiEngine, setAiEngine] = useState({
    provider: "Ollama",
    model: "llama3.1:latest",
    contextLength: "32K tokens",
    temperature: 0.7,
    maxTokens: 4096,
    promptStyle: "Professional",
    isConnected: true,
  });

  const [automation, setAutomation] = useState({
    autopilot: true,
    autoReplies: true,
    smartQueue: true,
    dmToEmail: false,
  });

  const showNotification = (msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
  };

  const topTabs = [
    { id: "general", label: "General", icon: FiUser },
    { id: "integrations", label: "Integrations (500+)", icon: FiShare2 },
    { id: "ai_engine", label: "AI Engine", icon: FiCpu },
    { id: "automation", label: "Automation", icon: FiSliders },
    { id: "security", label: "Security", icon: FiShield },
    { id: "billing", label: "Billing", icon: FiCreditCard },
    { id: "advanced", label: "Advanced", icon: FiGear },
  ];

  return (
    <div className="flex-1 bg-[#09090b] text-white overflow-y-auto font-sans relative flex flex-col h-full select-none">
      <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg("")} />

      {/* Clean Modular Header */}
      <SettingsHeader
        theme={theme}
        toggleTheme={toggleTheme}
        isSyncing={isSyncing}
        syncData={syncData}
        onOpenNotifications={onOpenNotifications}
      />

      {/* Main Container */}
      <div className="flex-1 px-6 pt-6 pb-8 space-y-6 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Tab Navigation */}
        <SettingsTabNav
          tabs={topTabs}
          activeTab={activeTopTab}
          setActiveTab={setActiveTopTab}
        />

        {/* Tab 1: General Profile & Brand Persona */}
        {activeTopTab === "general" && (
          <div className="space-y-6">
            <GeneralSection
              profile={profile}
              setProfile={setProfile}
              showNotification={showNotification}
            />
            <BrandPersonaSection showNotification={showNotification} />
          </div>
        )}

        {/* Tab 2: AI Engine */}
        {activeTopTab === "ai_engine" && (
          <AiEngineSection
            aiEngine={aiEngine}
            setAiEngine={setAiEngine}
            showNotification={showNotification}
          />
        )}

        {/* Tab 3: Social Accounts */}
        {activeTopTab === "integrations" && (
          <IntegrationsSection showNotification={showNotification} />
        )}

        {/* Tab 4: Automation */}
        {activeTopTab === "automation" && (
          <AutomationSection
            automation={automation}
            setAutomation={setAutomation}
            showNotification={showNotification}
          />
        )}

        {/* Tab 5: Security */}
        {activeTopTab === "security" && (
          <SecuritySection showNotification={showNotification} />
        )}

        {/* Tab 6: Billing */}
        {activeTopTab === "billing" && <BillingSection />}

        {/* Tab 7: Advanced Data */}
        {activeTopTab === "advanced" && (
          <AdvancedSection showNotification={showNotification} />
        )}
        </div>
      </div>
    </div>
  );
}

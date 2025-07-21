/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";

// Hooks
import { useSettings } from "@/hooks/useSettings";

// Constants
import {  
  DEFAULT_USER, 
  CONNECTED_SERVICES, 
  INTEGRATIONS 
} from "@/data/settings";

// Services
import { SettingsService } from "@/services/settingsService";

// Types
import { Integration } from "@/types/settings";
import AccountSettingsSection from "./Accounts";
import NotificationSettingsSection from "./Notification";
import AISettingsSection from "./AIFeatures";
import IntegrationSettingsSection from "./Integrations";
import PrivacySettingsSection from "./Privacy";
import FeedbackSection from "./Feedback";
import SettingsActions from "./SettingActions";

export default function SettingsPage() {
  // Settings hook
  const { settings, updateSetting, resetSettings, saveSettings, isLoading, error } = useSettings();
  
  // Local state
  const [displayName, setDisplayName] = useState(DEFAULT_USER.name);
  const [timezone, setTimezone] = useState("UTC-8");
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  
  // Services
  const settingsService = SettingsService.getInstance();

  // Effect for error handling
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDisconnectService = async (serviceId: string) => {
    try {
      await settingsService.disconnectService(serviceId);
      toast.success("Service disconnected successfully");
    } catch (err) {
      toast.error("Failed to disconnect service");
    }
  };

  const handleToggleIntegration = (integrationId: string, enabled: boolean) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, isEnabled: enabled }
          : integration
      )
    );
    
    if (integrationId === 'notion') {
      updateSetting('notionIntegration', enabled);
    }
  };

  const handleConnectIntegration = async (integrationId: string) => {
    try {
      await settingsService.connectIntegration(integrationId);
      handleToggleIntegration(integrationId, true);
      toast.success("Integration connected successfully");
    } catch (err) {
      toast.error("Failed to connect integration");
    }
  };

  const handleWebhookChange = (integrationId: string, webhookUrl: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, webhookUrl }
          : integration
      )
    );
    
    if (integrationId === 'zapier') {
      updateSetting('zapierWebhook', webhookUrl);
    }
  };

  const handlePrivacyModeChange = (enabled: boolean) => {
    updateSetting('privacyMode', enabled);
  };

  const handleExportData = async () => {
    try {
      await settingsService.exportData();
      toast.success("Data export initiated. You'll receive an email shortly.");
    } catch (err) {
      toast.error("Failed to export data");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await settingsService.deleteAccount();
        toast.success("Account deletion initiated");
      } catch (err) {
        toast.error("Failed to delete account");
      }
    }
  };

  const handleSubmitFeedback = async (feedback: string) => {
    try {
      await settingsService.submitFeedback(feedback);
      toast.success("Feedback submitted successfully");
    } catch (err) {
      toast.error("Failed to submit feedback");
    }
  };

  const handleSaveSettings = async () => {
    try {
      await saveSettings();
      toast.success("Settings saved successfully");
    } catch (err) {
      toast.error("Failed to save settings");
    }
  };

  const handleResetSettings = () => {
    if (window.confirm("Are you sure you want to reset all settings to defaults?")) {
      resetSettings();
      toast.success("Settings reset to defaults");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        
        <div className="px-6 py-6 max-w-4xl mx-auto overflow-y-auto scrollbar-hide">
          <style jsx>{`
            .scrollbar-hide {
              -ms-overflow-style: none;  /* Internet Explorer 10+ */
              scrollbar-width: none;  /* Firefox */
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;  /* Safari and Chrome */
            }
          `}</style>
          <div className="space-y-6 pb-8">
            <AccountSettingsSection
              connectedServices={CONNECTED_SERVICES}
              displayName={displayName}
              timezone={timezone}
              onDisplayNameChange={setDisplayName}
              onTimezoneChange={setTimezone}
              onDisconnectService={handleDisconnectService}
            />

            <NotificationSettingsSection
              settings={settings}
              onSettingChange={updateSetting}
            />

            <AISettingsSection
              settings={settings}
              onSettingChange={updateSetting}
            />

            <IntegrationSettingsSection
              integrations={integrations}
              onToggleIntegration={handleToggleIntegration}
              onConnectIntegration={handleConnectIntegration}
              onWebhookChange={handleWebhookChange}
            />

            <PrivacySettingsSection
              privacyMode={settings.privacyMode}
              onPrivacyModeChange={handlePrivacyModeChange}
              onExportData={handleExportData}
              onDeleteAccount={handleDeleteAccount}
            />

            <FeedbackSection
              onSubmitFeedback={handleSubmitFeedback}
            />

            <SettingsActions
              onReset={handleResetSettings}
              onSave={handleSaveSettings}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
  );
}
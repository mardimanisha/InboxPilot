/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from "react";
import { UserSettings } from "@/types/settings";
import { DEFAULT_SETTINGS } from "@/data/settings";

export const useSettings = (initialSettings: UserSettings = DEFAULT_SETTINGS) => {
  const [settings, setSettings] = useState<UserSettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSetting = useCallback(<K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const saveSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {

      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Settings saved:', settings);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  return {
    settings,
    updateSetting,
    resetSettings,
    saveSettings,
    isLoading,
    error,
  };
};
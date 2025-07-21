export interface UserSettings {
    emailNotifications: boolean;
    dailyDigest: boolean;
    digestTime: string;
    aiSuggestions: boolean;
    autoClassification: boolean;
    notionIntegration: boolean;
    zapierWebhook: string;
    replyTone: "professional" | "friendly" | "casual" | "formal";
    privacyMode: boolean;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    initials: string;
  }
  
  export interface NavigationItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive?: boolean;
  }
  
  export interface ConnectedService {
    id: string;
    name: string;
    email?: string;
    isConnected: boolean;
    icon: React.ComponentType<{ className?: string }>;
  }
  
  export interface Integration {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    isEnabled: boolean;
    hasWebhook?: boolean;
    webhookUrl?: string;
  }
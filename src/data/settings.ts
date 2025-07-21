// constants/settings.ts
import {
    Home,
    Settings,
    CheckSquare,
    User,
    Mail,
    Database,
    Zap,
  } from "lucide-react";
  import {
    NavigationItem,
    ConnectedService,
    Integration,
  } from "@/types/settings";
  
  export const NAVIGATION_ITEMS: NavigationItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/settings", label: "Settings", icon: Settings, isActive: true },
    { href: "/profile", label: "Profile", icon: User },
  ];
  
  export const REPLY_TONE_OPTIONS = [
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Friendly" },
    { value: "casual", label: "Casual" },
    { value: "formal", label: "Formal" },
  ] as const;
  
  export const TIMEZONE_OPTIONS = [
    { value: "UTC-8", label: "UTC-8 (Pacific Time)" },
    { value: "UTC-5", label: "UTC-5 (Eastern Time)" },
    { value: "UTC+0", label: "UTC+0 (GMT)" },
  ] as const;
  
  export const CONNECTED_SERVICES: ConnectedService[] = [
    {
      id: "gmail",
      name: "Gmail Connected",
      email: "john.doe@company.com",
      isConnected: true,
      icon: Mail,
    },
  ];
  
  export const INTEGRATIONS: Integration[] = [
    {
      id: "notion",
      name: "Notion Integration",
      description: "Sync tasks to your Notion workspace",
      icon: Database,
      isEnabled: false,
    },
    {
      id: "zapier",
      name: "Zapier Webhook",
      description: "Send tasks to any app via Zapier",
      icon: Zap,
      isEnabled: false,
      hasWebhook: true,
      webhookUrl: "",
    },
  ];
  
  export const DEFAULT_SETTINGS = {
    emailNotifications: true,
    dailyDigest: true,
    digestTime: "08:00",
    aiSuggestions: true,
    autoClassification: true,
    notionIntegration: false,
    zapierWebhook: "",
    replyTone: "professional" as const,
    privacyMode: true,
  };
  
  export const DEFAULT_USER = {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    initials: "JD",
  };
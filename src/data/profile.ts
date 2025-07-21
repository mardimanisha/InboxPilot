// constants/profile.ts
import {
    TimeZoneOption,
    NavItem,
    ConnectedAccount,
    AccountStats,
  } from "../types/profile";
  
  export const TIMEZONE_OPTIONS: TimeZoneOption[] = [
    { value: "UTC-8 (Pacific Time)", label: "UTC-8 (Pacific Time)" },
    { value: "UTC-5 (Eastern Time)", label: "UTC-5 (Eastern Time)" },
    { value: "UTC+0 (GMT)", label: "UTC+0 (GMT)" },
    { value: "UTC+1 (CET)", label: "UTC+1 (CET)" },
  ];
  
  export const NAV_ITEMS: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: "Home" },
    { href: "/tasks", label: "Tasks", icon: "CheckSquare" },
    { href: "/settings", label: "Settings", icon: "Settings" },
    { href: "/profile", label: "Profile", icon: "User", isActive: true },
  ];
  
  export const MOCK_ACCOUNT_STATS: AccountStats = {
    emailsProcessed: 1247,
    tasksCreated: 89,
    aiRepliesUsed: 156,
  };
  
  export const MOCK_CONNECTED_ACCOUNTS: ConnectedAccount[] = [
    {
      id: "gmail",
      name: "Gmail",
      icon: "Mail",
      isConnected: true,
      connectedSince: "Jan 2024",
    },
    {
      id: "notion",
      name: "Notion",
      icon: "CheckSquare",
      isConnected: false,
    },
  ];
  
  export const INITIAL_PROFILE_DATA = {
    name: "John Doe",
    email: "john.doe@company.com",
    title: "Senior Product Manager",
    company: "Tech Corp",
    bio: "Passionate about building products that make a difference. Love working with cross-functional teams to deliver exceptional user experiences.",
    location: "San Francisco, CA",
    timezone: "UTC-8 (Pacific Time)",
  };
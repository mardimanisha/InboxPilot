// types/profile.ts
export interface Profile {
    name: string;
    email: string;
    title: string;
    company: string;
    bio: string;
    location: string;
    timezone: string;
    avatar_url?: string;
  }
  
  export interface AccountStats {
    emailsProcessed: number;
    tasksCreated: number;
    aiRepliesUsed: number;
  }
  
  export interface ConnectedAccount {
    id: string;
    name: string;
    icon: string;
    isConnected: boolean;
    connectedSince?: string;
  }
  
  export interface NavItem {
    href: string;
    label: string;
    icon: string;
    isActive?: boolean;
  }
  
  export interface TimeZoneOption {
    value: string;
    label: string;
  }
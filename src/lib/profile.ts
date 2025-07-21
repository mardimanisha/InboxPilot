// utils/profile.ts
import { Profile } from "@/types/profile";

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

export const formatAccountStat = (value: number): string => {
  return value.toLocaleString();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateProfile = (
  profile: Profile
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!profile.name.trim()) {
    errors.push("Name is required");
  }

  if (!profile.email.trim()) {
    errors.push("Email is required");
  } else if (!validateEmail(profile.email)) {
    errors.push("Please enter a valid email address");
  }

  if (!profile.title.trim()) {
    errors.push("Job title is required");
  }

  if (!profile.company.trim()) {
    errors.push("Company is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getProfileDisplayName = (profile: Profile): string => {
  return profile.name || "Unknown User";
};

export const getProfileAvatarFallback = (profile: Profile): string => {
  return getInitials(profile.name) || "UN";
};
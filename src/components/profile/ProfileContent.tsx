"use client"

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileForm } from "./ProfileForm";
import { MOCK_ACCOUNT_STATS, MOCK_CONNECTED_ACCOUNTS, TIMEZONE_OPTIONS } from "@/data/profile";
import { AccountStats } from "./AccountStats";
import { ConnectedAccounts } from "./ConnectedAccounts";
import { LogoutButton } from "./LogoutButton";


export default function ProfilePage() {
  const {
    profile,
    isEditing,
    updateProfile,

  } = useProfile();

  const handleImageUpload = () => {
    // TODO: Implement image upload logic
    console.log("Image upload clicked");
  };

  const handleAccountConnect = (accountId: string) => {
    // TODO: Implement account connection logic
    console.log("Connect account:", accountId);
  };

  const handleAccountDisconnect = (accountId: string) => {
    // TODO: Implement account disconnection logic
    console.log("Disconnect account:", accountId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col">
        {/* Profile Content */}
        <div className="flex-1 px-6 py-6 max-w-4xl mx-auto overflow-auto">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <ProfileAvatar
                  profile={profile}
                  isEditing={isEditing}
                  onImageUpload={handleImageUpload}
                />
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm
                  profile={profile}
                  isEditing={isEditing}
                  timezoneOptions={TIMEZONE_OPTIONS}
                  onProfileUpdate={updateProfile}
                />
              </CardContent>
            </Card>

            {/* Account Statistics */}
            <AccountStats stats={MOCK_ACCOUNT_STATS} />

            {/* Connected Accounts */}
            <ConnectedAccounts
              accounts={MOCK_CONNECTED_ACCOUNTS}
              onConnect={handleAccountConnect}
              onDisconnect={handleAccountDisconnect}
            />

            <LogoutButton 
                onClick={() => console.log('Logout clicked')} 
                variant="ghost"
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            />
            
          </div>
        </div>
      </div>
    </div>
  );
}
"use client"

import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileForm } from "./ProfileForm";
import { MOCK_ACCOUNT_STATS, MOCK_CONNECTED_ACCOUNTS, TIMEZONE_OPTIONS } from "@/data/profile";
import { AccountStats } from "./AccountStats";
import { ConnectedAccounts } from "./ConnectedAccounts";
import { AlertCircle, Camera, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";


export default function ProfilePage() {
  const {
    profile,
    isEditing,
    updateProfile,
    isLoading,
    error,
    saveProfile,
  } = useProfile();

  const handleImageUpdate = async (file: File) => {
    try {
      // In a real app, you would upload the file to a server
      // For now, we'll just create a local URL for the file
      const imageUrl = URL.createObjectURL(file);
      
      // Update local state
      updateProfile({ avatar_url: imageUrl });
      
      return imageUrl;
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw error;
    }
  };

  const handleAccountConnect = async (accountId: string) => {
    // TODO: Implement actual OAuth connection logic
    console.log("Connect account:", accountId);
  };

  const handleAccountDisconnect = async (accountId: string) => {
    // TODO: Implement actual OAuth disconnection logic
    console.log("Disconnect account:", accountId);
  };

  // Memoize the account stats to prevent unnecessary re-renders
  const accountStats = useMemo(() => ({
    ...MOCK_ACCOUNT_STATS,
    // You can replace these with actual stats from the user's data
  }), [profile]);

  const connectedAccounts = useMemo(() => (
    MOCK_CONNECTED_ACCOUNTS.map(account => ({
      ...account,
      // Update connected status based on actual data if available
      isConnected: account.id === 'gmail' // Example: only Gmail is connected
    }))
  ), []);

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md p-8">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mb-4">
            {error}
          </AlertDescription>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => saveProfile(profile)}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

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
                  isLoading={isLoading}
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
                  onProfileUpdate={updateProfile}
                  timezoneOptions={TIMEZONE_OPTIONS}
                />
                
                <div className="flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => saveProfile(profile)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => updateProfile(profile)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => updateProfile(profile)}
                      disabled={isLoading}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            
              <AccountStats stats={accountStats} />
              <ConnectedAccounts
                accounts={connectedAccounts}
                onConnect={handleAccountConnect}
                onDisconnect={handleAccountDisconnect}
              />
          </div>
        </div>
      </div>
    </div>
  );
}
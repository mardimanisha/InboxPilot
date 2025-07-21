// hooks/useProfile.ts
import { useState, useCallback } from 'react';
import { INITIAL_PROFILE_DATA } from '@/data/profile';
import { Profile } from '@/types/profile';

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const handleEditToggle = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Profile saved:', profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    // Reset to original data if needed
    setProfile(INITIAL_PROFILE_DATA);
  }, []);

  return {
    profile,
    isEditing,
    isLoading,
    updateProfile,
    handleEditToggle,
    handleSave,
    handleCancel,
  };
};
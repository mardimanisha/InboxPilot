'use client'
import { useState, useCallback } from 'react';
import { INITIAL_PROFILE_DATA } from '@/data/profile';
import { Profile } from '@/types/profile';

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const saveProfile = async (updates: Partial<Profile>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update local state
      setProfile(prev => ({ ...prev, ...updates }));
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileImage = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would upload the file to a server
      // For now, we'll just create a local URL for the file
      const imageUrl = URL.createObjectURL(file);
      
      // Update local state
      setProfile(prev => ({
        ...prev,
        avatar_url: imageUrl
      }));
      
      return imageUrl;
    } catch (error) {
      console.error('Error updating profile image:', error);
      setError('Failed to update profile image');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isEditing,
    isLoading,
    error,
    updateProfile,
    saveProfile,
    updateProfileImage,
    setIsEditing,
  };
};
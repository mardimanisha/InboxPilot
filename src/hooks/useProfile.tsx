'use client'
import { useState, useCallback, useEffect } from 'react';
import { INITIAL_PROFILE_DATA } from '@/data/profile';
import { Profile } from '@/types/profile';
import supabase from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      // Reset profile if user logs out
      setProfile(INITIAL_PROFILE_DATA);
    }
  }, [user]);

  const ensureProfileExists = async (userId: string, userEmail: string, userMetadata: any = {}) => {
    // First, try to get the profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching profile:', fetchError);
      throw fetchError;
    }

    // If profile exists, return it
    if (existingProfile) {
      return existingProfile;
    }

    // If no profile exists, create one
    console.log('No profile found, creating new profile...');
    
    const userName = userMetadata?.full_name || 
                    userMetadata?.name || 
                    userEmail?.split('@')[0] || 
                    'User';
    
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: userEmail,
        full_name: userName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (createError) {
      console.error('Error creating profile:', createError);
      throw createError;
    }
    
    console.log('New profile created:', newProfile);
    return newProfile;
  };

  const fetchUserProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Ensure profile exists and get it
      const profile = await ensureProfileExists(user.id, user.email || '', user.user_metadata);
      
      // Map the database fields to our profile state
      setProfile({
        name: profile.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: profile.email || user.email || '',
        title: profile.title || '',
        company: profile.company || '',
        bio: profile.bio || '',
        location: profile.location || '',
        timezone: profile.timezone || 'UTC+0 (GMT)',
        avatar_url: profile.avatar_url || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const handleEditToggle = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const handleSave = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.name,
          email: user.email,
          title: profile.title,
          company: profile.company,
          bio: profile.bio,
          location: profile.location,
          timezone: profile.timezone,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  }, [user, profile]);

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
    error,
    refreshProfile: fetchUserProfile,
    setIsEditing
  };
};

export const toggleEditMode = () => {
  const { setIsEditing } = useProfile();
  setIsEditing(prev => !prev);
};
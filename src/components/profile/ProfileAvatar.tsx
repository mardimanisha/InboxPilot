import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Loader2 } from "lucide-react";
import { Profile } from '@/types/profile';
import { getProfileAvatarFallback } from '@/lib/profile';
import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  profile: Profile;
  isEditing: boolean;
  onImageUpload?: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profile,
  isEditing,
  onImageUpload,
  isLoading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarClick = () => {
    if (isEditing && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    try {
      setIsUploading(true);
      await onImageUpload(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex items-center space-x-6">
      <div className="relative group">
        <div 
          className={cn(
            "relative rounded-full overflow-hidden",
            isEditing && !isUploading && "cursor-pointer hover:ring-2 hover:ring-blue-500"
          )}
          onClick={handleAvatarClick}
        >
          <Avatar className="h-24 w-24">
            {profile.avatar_url && (
              <AvatarImage 
                src={profile.avatar_url} 
                alt={profile.name}
                className={cn("transition-opacity", (isUploading || isLoading) && "opacity-50")}
              />
            )}
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
              {getProfileAvatarFallback(profile)}
            </AvatarFallback>
          </Avatar>
          
          {(isUploading || isLoading) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
        
        {isEditing && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={isUploading || isLoading}
            />
            <Button
              size="sm"
              type="button"
              onClick={handleAvatarClick}
              className={cn(
                "absolute -bottom-2 -right-2 rounded-full bg-white border-2 border-gray-200 shadow-sm",
                "hover:bg-gray-50 transition-colors",
                (isUploading || isLoading) && "opacity-50 cursor-not-allowed"
              )}
              disabled={isUploading || isLoading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4 cursor-pointer text-gray-800" />
              )}
            </Button>
          </>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center space-x-4 mb-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLoading ? (
              <span className="inline-block h-7 w-48 bg-gray-200 rounded animate-pulse"></span>
            ) : (
              profile.name
            )}
          </h2>
          {!isLoading && (
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          )}
        </div>
        <p className="text-gray-600 mb-1">
          {isLoading ? (
            <span className="inline-block h-5 w-64 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            `${profile.title || 'No title'}${profile.company ? ` at ${profile.company}` : ''}`
          )}
        </p>
        <p className="text-gray-500 text-sm">
          {isLoading ? (
            <span className="inline-block h-4 w-32 bg-gray-200 rounded animate-pulse mt-1"></span>
          ) : (
            profile.location || 'No location set'
          )}
        </p>
      </div>
    </div>
  );
};

import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";
import { Profile } from '@/types/profile';
import { getProfileAvatarFallback } from '@/lib/profile';


interface ProfileAvatarProps {
  profile: Profile;
  isEditing: boolean;
  onImageUpload?: () => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profile,
  isEditing,
  onImageUpload,
}) => {
  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
            {getProfileAvatarFallback(profile)}
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <Button
            size="sm"
            onClick={onImageUpload}
            className="absolute -bottom-2 -right-2 rounded-full bg-white border-2 border-gray-200 shadow-sm"
          >
            <Camera className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center space-x-4 mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
          <Badge className="bg-green-100 text-green-800">Active</Badge>
        </div>
        <p className="text-gray-600 mb-1">
          {profile.title} at {profile.company}
        </p>
        <p className="text-gray-500 text-sm">{profile.location}</p>
      </div>
    </div>
  );
};
// components/ProfileForm.tsx
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Profile, TimeZoneOption } from '@/types/profile';

interface ProfileFormProps {
  profile: Profile;
  isEditing: boolean;
  timezoneOptions: TimeZoneOption[];
  onProfileUpdate: (updates: Partial<Profile>) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  isEditing,
  timezoneOptions,
  onProfileUpdate,
}) => {
  const handleInputChange = (field: keyof Profile) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    onProfileUpdate({ [field]: e.target.value });
  };

  const inputClassName = !isEditing ? "bg-gray-50" : "";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <Input
            value={profile.name}
            onChange={handleInputChange('name')}
            disabled={!isEditing}
            className={inputClassName}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Email Address</label>
          <Input
            value={profile.email}
            onChange={handleInputChange('email')}
            disabled={!isEditing}
            className={inputClassName}
            type="email"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Job Title</label>
          <Input
            value={profile.title}
            onChange={handleInputChange('title')}
            disabled={!isEditing}
            className={inputClassName}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Company</label>
          <Input
            value={profile.company}
            onChange={handleInputChange('company')}
            disabled={!isEditing}
            className={inputClassName}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Location</label>
          <Input
            value={profile.location}
            onChange={handleInputChange('location')}
            disabled={!isEditing}
            className={inputClassName}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Time Zone</label>
          <select
            value={profile.timezone}
            onChange={handleInputChange('timezone')}
            disabled={!isEditing}
            className={`w-full p-2 border rounded-md ${inputClassName}`}
          >
            {timezoneOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium">Bio</label>
        <Textarea
          value={profile.bio}
          onChange={handleInputChange('bio')}
          disabled={!isEditing}
          className={inputClassName}
          rows={4}
          placeholder="Tell us about yourself..."
        />
      </div>
    </div>
  );
};
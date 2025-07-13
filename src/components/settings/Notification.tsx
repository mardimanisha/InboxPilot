// components/settings/NotificationSettingsSection.tsx
import React from "react";
import { Bell, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { UserSettings } from "@/types/settings";

interface NotificationSettingsSectionProps {
  settings: Pick<UserSettings, 'emailNotifications' | 'dailyDigest' | 'digestTime'>;
  onSettingChange: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
}

interface SettingToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SettingToggle: React.FC<SettingToggleProps> = ({ title, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
};

const NotificationSettingsSection: React.FC<NotificationSettingsSectionProps> = ({
  settings,
  onSettingChange,
}) => {
  const { emailNotifications, dailyDigest, digestTime } = settings;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Notifications</span>
        </CardTitle>
        <CardDescription>Configure how and when you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SettingToggle
          title="Email Notifications"
          description="Receive notifications for urgent emails"
          checked={emailNotifications}
          onChange={(checked) => onSettingChange("emailNotifications", checked)}
        />

        <SettingToggle
          title="Daily Priority Digest"
          description="Morning summary of important emails and tasks"
          checked={dailyDigest}
          onChange={(checked) => onSettingChange("dailyDigest", checked)}
        />

        {dailyDigest && (
          <div className="ml-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <label className="text-sm font-medium">Digest Time</label>
                <Input
                  type="time"
                  value={digestTime}
                  onChange={(e) => onSettingChange("digestTime", e.target.value)}
                  className="mt-1 w-32"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettingsSection;
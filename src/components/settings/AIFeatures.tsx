
import React from "react";
import { Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { UserSettings } from "@/types/settings";
import { REPLY_TONE_OPTIONS } from "@/data/settings";

interface AIFeaturesProps {
  settings: Pick<UserSettings, 'autoClassification' | 'aiSuggestions' | 'replyTone'>;
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

const AISettingsSection: React.FC<AIFeaturesProps> = ({
  settings,
  onSettingChange,
}) => {
  const { autoClassification, aiSuggestions, replyTone } = settings;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>AI Features</span>
        </CardTitle>
        <CardDescription>Customize AI behavior and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SettingToggle
          title="Auto Email Classification"
          description="Automatically categorize incoming emails"
          checked={autoClassification}
          onChange={(checked) => onSettingChange("autoClassification", checked)}
        />

        <SettingToggle
          title="AI Reply Suggestions"
          description="Generate smart reply options"
          checked={aiSuggestions}
          onChange={(checked) => onSettingChange("aiSuggestions", checked)}
        />

        {aiSuggestions && (
          <div className="ml-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium">Reply Tone</label>
              <select
                value={replyTone}
                onChange={(e) => onSettingChange("replyTone", e.target.value as UserSettings['replyTone'])}
                className="w-full mt-1 p-2 border rounded-md"
              >
                {REPLY_TONE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AISettingsSection;
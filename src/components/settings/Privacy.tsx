
import React from "react";
import { Shield, Key, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";


interface PrivacyProps {
  privacyMode: boolean;
  onPrivacyModeChange: (enabled: boolean) => void;
  onExportData: () => void;
  onDeleteAccount: () => void;
}

const PrivacySettingsSection: React.FC<PrivacyProps> = ({
  privacyMode,
  onPrivacyModeChange,
  onExportData,
  onDeleteAccount,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Privacy & Security</span>
        </CardTitle>
        <CardDescription>Control your data and privacy settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Privacy Mode</p>
            <p className="text-sm text-gray-600">Enhanced privacy with minimal data retention</p>
          </div>
          <Switch
            checked={privacyMode}
            onCheckedChange={onPrivacyModeChange}
          />
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Data Protection</p>
              <p className="text-sm text-blue-700">
                Your emails are processed securely and we never store full email content without explicit
                permission. All data is encrypted in transit and at rest.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start bg-transparent"
            onClick={onExportData}
          >
            <Key className="h-4 w-4 mr-2" />
            Export Your Data
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
            onClick={onDeleteAccount}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettingsSection;
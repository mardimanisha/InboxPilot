
import React from "react";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Integration } from "@/types/settings";

interface IntegrationsProps {
  integrations: Integration[];
  onToggleIntegration: (integrationId: string, enabled: boolean) => void;
  onConnectIntegration: (integrationId: string) => void;
  onWebhookChange: (integrationId: string, webhookUrl: string) => void;
}

interface IntegrationItemProps {
  integration: Integration;
  onToggle: (integrationId: string, enabled: boolean) => void;
  onConnect: (integrationId: string) => void;
  onWebhookChange: (integrationId: string, webhookUrl: string) => void;
}

const IntegrationItem: React.FC<IntegrationItemProps> = ({
  integration,
  onToggle,
  onConnect,
  onWebhookChange,
}) => {
  const { id, name, description, icon: Icon, isEnabled, hasWebhook, webhookUrl } = integration;

  const getIconBgColor = () => {
    switch (id) {
      case 'notion':
        return 'bg-gray-100';
      case 'zapier':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getIconColor = () => {
    switch (id) {
      case 'notion':
        return 'text-gray-600';
      case 'zapier':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${getIconBgColor()} rounded-full flex items-center justify-center`}>
            <Icon className={`h-5 w-5 ${getIconColor()}`} />
          </div>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) => onToggle(id, checked)}
          />
          {!isEnabled && (
            <Button variant="outline" size="sm" onClick={() => onConnect(id)}>
              Connect
            </Button>
          )}
        </div>
      </div>
      
      {hasWebhook && (
        <Input
          placeholder="Enter your webhook URL"
          value={webhookUrl || ''}
          onChange={(e) => onWebhookChange(id, e.target.value)}
        />
      )}
    </div>
  );
};

const IntegrationSettingsSection: React.FC<IntegrationsProps> = ({
  integrations,
  onToggleIntegration,
  onConnectIntegration,
  onWebhookChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Integrations</span>
        </CardTitle>
        <CardDescription>Connect with external tools and services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {integrations.map((integration) => (
          <IntegrationItem
            key={integration.id}
            integration={integration}
            onToggle={onToggleIntegration}
            onConnect={onConnectIntegration}
            onWebhookChange={onWebhookChange}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default IntegrationSettingsSection;
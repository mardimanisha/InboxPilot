
import React from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConnectedService } from "@/types/settings";
import { TIMEZONE_OPTIONS } from "@/data/settings";

interface AccountsProps {
  connectedServices: ConnectedService[];
  displayName: string;
  timezone: string;
  onDisplayNameChange: (value: string) => void;
  onTimezoneChange: (value: string) => void;
  onDisconnectService: (serviceId: string) => void;
}

interface ConnectedServiceItemProps {
  service: ConnectedService;
  onDisconnect: (serviceId: string) => void;
}

const ConnectedServiceItem: React.FC<ConnectedServiceItemProps> = ({ service, onDisconnect }) => {
  const { id, name, email, icon: Icon } = service;
  
  return (
    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Icon className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <p className="font-medium">{name}</p>
          {email && <p className="text-sm text-gray-600">{email}</p>}
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onDisconnect(id)}
      >
        Disconnect
      </Button>
    </div>
  );
};

const AccountSettingsSection: React.FC<AccountsProps> = ({
  connectedServices,
  displayName,
  timezone,
  onDisplayNameChange,
  onTimezoneChange,
  onDisconnectService,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Account Settings</span>
        </CardTitle>
        <CardDescription>Manage your account and connected services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connectedServices.map((service) => (
          <ConnectedServiceItem
            key={service.id}
            service={service}
            onDisconnect={onDisconnectService}
          />
        ))}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Display Name</label>
            <Input
              value={displayName}
              onChange={(e) => onDisplayNameChange(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Time Zone</label>
            <select
              value={timezone}
              onChange={(e) => onTimezoneChange(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
            >
              {TIMEZONE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSettingsSection;
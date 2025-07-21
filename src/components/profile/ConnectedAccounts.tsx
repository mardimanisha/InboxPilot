import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckSquare } from "lucide-react";
import { ConnectedAccount } from '@/types/profile';

interface ConnectedAccountsProps {
  accounts: ConnectedAccount[];
  onConnect: (accountId: string) => void;
  onDisconnect: (accountId: string) => void;
}

const iconMap = {
  Mail,
  CheckSquare,
};

export const ConnectedAccounts: React.FC<ConnectedAccountsProps> = ({
  accounts,
  onConnect,
}) => {
  const renderAccount = (account: ConnectedAccount) => {
    const Icon = iconMap[account.icon as keyof typeof iconMap];
    const isConnected = account.isConnected;

    return (
      <div
        key={account.id}
        className={`flex items-center justify-between p-4 rounded-lg border ${
          isConnected 
            ? 'bg-green-50 border-green-200' 
            : 'border-gray-200'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isConnected ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <Icon className={`h-5 w-5 ${
              isConnected ? 'text-green-600' : 'text-gray-600'
            }`} />
          </div>
          <div>
            <p className="font-medium">{account.name}</p>
            <p className="text-sm text-gray-600">
              {isConnected && account.connectedSince 
                ? `Connected since ${account.connectedSince}`
                : 'Not connected'
              }
            </p>
          </div>
        </div>
        
        {isConnected ? (
          <Badge className="bg-green-100 text-green-800">Connected</Badge>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onConnect(account.id)}
          >
            Connect
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
        <CardDescription>Manage your connected services and integrations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {accounts.map(renderAccount)}
        </div>
      </CardContent>
    </Card>
  );
};

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountStats as AccountStatsType } from '@/types/profile';
import { formatAccountStat } from '@/lib/profile';

interface AccountStatsProps {
  stats: AccountStatsType;
}

export const AccountStats: React.FC<AccountStatsProps> = ({ stats }) => {
  const statsData = [
    {
      value: stats.emailsProcessed,
      label: 'Emails Processed',
      color: 'text-blue-600',
    },
    {
      value: stats.tasksCreated,
      label: 'Tasks Created',
      color: 'text-green-600',
    },
    {
      value: stats.aiRepliesUsed,
      label: 'AI Replies Used',
      color: 'text-purple-600',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Statistics</CardTitle>
        <CardDescription>Your InboxPilot usage overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {formatAccountStat(stat.value)}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
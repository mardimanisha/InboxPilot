import React from 'react'
import { Button } from '../ui/button'
import { Bell, Search } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'

export default function DashboardHeader({ title, badge }: { title: string; badge: string }) {
    return (
        <header className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-semibold text-gray-900">{ title }</h1>
              <Badge className="bg-green-50 text-green-700 border-green-200"> {badge}</Badge>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input placeholder="Search emails..." className="w-80 pl-10 bg-gray-50 border-gray-200" />
                </div>
                <Button variant="outline" size="sm" className="bg-white border-gray-200">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>
    )
}

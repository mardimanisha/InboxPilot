// data/headers.ts
import { Button } from "@/components/ui/button";
import { Edit, LogOut, Plus, Bell, Search } from "lucide-react";
import { HeaderConfig } from "@/types/header";
import { toggleEditMode } from "@/hooks/useProfile";

export const headerConfigs: Record<string, HeaderConfig> = {
  profile: {
    title: "Profile",
    badge: {
      text: "👤 Profile",
      className: "bg-blue-100 text-blue-800",
    },
    actions: [
      {
        id: "edit",
        element: (
          <Button onClick={toggleEditMode}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ),
      },
    ],
  },

  settings: {
    title: "Settings",
    badge: {
      text: "⚙️ Settings",
      className: "bg-purple-100 text-purple-800",
    },
    actions: [
      {
        id: "logout",
        element: (
          <Button variant="outline" size="sm">
            <LogOut className="h-4 w-4" />
          </Button>
        ),
      },
    ],
  },

  dashboard: {
    title: "Dashboard",
    badge: {
      text: "✨ AI Active",
      className: "bg-green-50 text-green-700 border-green-200",
    },
    search: {
      placeholder: "Search emails...",
      inputClass: "w-80 pl-10 bg-gray-50 border-gray-200",
      icon: <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />,
    },
    actions: [
      {
        id: "bell",
        element: (
          <Button variant="outline" size="sm" className="bg-white border-gray-200">
            <Bell className="h-4 w-4" />
          </Button>
        ),
      },
    ],
  },

  tasks: {
    title: "Tasks",
    badge: {
      text: "✅ Task Manager",
      className: "bg-green-100 text-green-800",
    },
    search: {
      placeholder: "Search tasks...",
      inputClass: "w-64",
      icon: <Search className="h-4 w-4 text-gray-400" />,
    },
    actions: [
      {
        id: "add-task",
        element: (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        ),
      },
    ],
  },
};
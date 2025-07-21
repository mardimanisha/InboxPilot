"use client"

import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Home,
  CheckSquare,
  Settings,
  User,
} from "lucide-react"
import Logo from "../common/Logo"


export default function Sidebar() {
  const navItems = [
    {
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      href: "/dashboard",
      active: true,
    },
    {
      label: "Tasks",
      icon: <CheckSquare className="h-5 w-5" />,
      href: "/tasks",
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/settings",
    },
    {
      label: "Profile",
      icon: <User className="h-5 w-5" />,
      href: "/profile",
    },
  ]

    return (
        <div className="h-screen bg-gray-50 flex">
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* Logo */}
                <div className="p-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <Logo />
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-6 space-y-2">
                    {navItems.map(({ label, icon, href, active }) => (
                        <Link key={label} href={href}>
                            <div
                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors font-medium
                                ${active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                            >
                                {icon}
                                <span>{label}</span>
                            </div>
                        </Link>
                    ))}
                </nav>

                {/* User Profile */}
                <div className="p-6 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                JD
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">John Doe</p>
                            <p className="text-xs text-gray-500">john.doe@company.com</p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    )
}
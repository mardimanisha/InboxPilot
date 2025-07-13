// src/components/layout/AppLayout.tsx
"use client"
import Sidebar from "./Sidebar"
import { ReactNode } from "react"
import DashboardHeader from "./DashboardHeader";

export default function AppLayout({ title, badge, children }: { title: string; badge: string; children: ReactNode }) {
  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen">
        <DashboardHeader title={title} badge={badge} />
        <main className="flex-1 px-6 py-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

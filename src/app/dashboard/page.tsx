import MainContent from "@/components/common/MainContent";
import Sidebar from "@/components/layout/Sidebar";
import React from "react";

export default function DashboardPage() {
    return (
        <div className="h-screen bg-gray-50 flex">
            <Sidebar />
            <MainContent />
        </div>
  )
}
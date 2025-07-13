
import DashboardContent from "@/components/dashboard/DashboardContent";
import AppLayout from "@/components/layout/AppLayout";
import React from "react";

export default function DashboardPage() {
    return (
        <AppLayout title="Dashboard" badge="✨ AI Active">
            <DashboardContent />
        </AppLayout>
  )
}

import DashboardContent from "@/components/dashboard/DashboardContent";
import AppLayout from "@/components/layout/AppLayout";
import { headerConfigs } from "@/data/header";
import React from "react";

export default function DashboardPage() {
    return (
        <AppLayout headerConfig={headerConfigs.dashboard}>
            <DashboardContent />
        </AppLayout>
    )
}
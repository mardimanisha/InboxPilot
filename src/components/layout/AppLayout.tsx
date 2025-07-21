"use client";

import { HeaderConfig } from "@/types/header";
import Sidebar from "./Sidebar";
import { ReactNode } from "react";
import { HeaderProvider } from "./dashboardHeader/HeaderProvider";



export default function AppLayout({
  headerConfig,
  children,
}: {
  headerConfig: HeaderConfig;
  children: ReactNode;
}) {
  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen">
        <HeaderProvider config={headerConfig}>
          <main className="flex-1 px-6 py-6 overflow-auto">{children}</main>
        </HeaderProvider>
      </div>
    </div>
  );
}
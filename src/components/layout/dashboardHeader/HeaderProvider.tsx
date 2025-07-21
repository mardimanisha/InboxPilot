
import { ReactNode } from "react";
import { HeaderProvider as ContextProvider } from "@/contexts/header-context";
import { HeaderConfig } from "@/types/header";
import { DashboardHeader } from "./DashboardHeader";


export const HeaderProvider = ({
  config,
  children,
}: {
  config: HeaderConfig;
  children: ReactNode;
}) => {
  return (
    <ContextProvider config={config}>
      <DashboardHeader />
      {children}
    </ContextProvider>
  );
};

"use client";

import { createContext, useContext, ReactNode } from "react";
import { HeaderConfig } from "@/types/header";

const HeaderContext = createContext<HeaderConfig | null>(null);

export const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (!context) throw new Error("useHeaderContext must be used within HeaderProvider");
  return context;
};

export const HeaderProvider = ({
  config,
  children,
}: {
  config: HeaderConfig;
  children: ReactNode;
}) => {
  return <HeaderContext.Provider value={config}>{children}</HeaderContext.Provider>;
};
// types/header.ts
import { ReactNode } from "react";

export interface HeaderBadge {
  text: string;
  className: string;
}

export interface HeaderAction {
  id: string;
  element: ReactNode;
}

export interface HeaderSearch {
  placeholder: string;
  inputClass?: string;
  icon?: ReactNode;
}

export interface HeaderConfig {
  title: string;
  badge?: HeaderBadge;
  search?: HeaderSearch;
  actions?: HeaderAction[];
}
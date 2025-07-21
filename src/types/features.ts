export type FeatureIconType =
  | "Brain"
  | "Zap"
  | "CheckCircle"
  | "Clock"
  | "Shield"
  | "Users";

export interface FeatureItem {
  title: string;
  description: string;
  icon: FeatureIconType;
  color: string;
}
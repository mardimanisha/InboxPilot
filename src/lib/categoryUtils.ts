import { AlertCircle, Clock, Info, X, Mail } from "lucide-react";

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "urgent":
      return <AlertCircle className="h-4 w-4" />;
    case "actionNeeded":
      return <Clock className="h-4 w-4" />;
    case "fyi":
      return <Info className="h-4 w-4" />;
    case "ignore":
      return <X className="h-4 w-4" />;
    default:
      return <Mail className="h-4 w-4" />;
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case "urgent":
      return "bg-red-50 text-red-700 border-red-200";
    case "actionNeeded":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "fyi":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "ignore":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

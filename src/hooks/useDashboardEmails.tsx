import { useState } from "react";
import { EmailCategory } from "@/types/email";
import { mockEmails } from "@/data/emails";
import { AlertCircle, Clock, Info, Mail, X } from "lucide-react";

export function useDashboardEmails() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredEmails = mockEmails.filter((email) =>
    selectedFilter === "all" ? true : email.category === selectedFilter
  );

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  const getCategoryIcon = (category: EmailCategory) => {
    switch (category) {
      case "urgent":
        return <AlertCircle className="h-6 w-6 bg-red-50 text-red-700 border-red-200" />;
      case "actionNeeded":
        return <Clock className="h-6 w-6 bg-yellow-50 text-yellow-700 border-yellow-200" />;
      case "fyi":
        return <Info className="h-6 w-6 bg-blue-50 text-blue-700 border-blue-200" />;
      case "ignore":
        return <X className="h-6 w-6 bg-gray-50 text-gray-700 border-gray-200" />;
      default:
        return <Mail className="h-6 w-6 bg-gray-50 text-gray-700 border-gray-200" />;
    }
  };

  const getCategoryColor = (category: EmailCategory) => {
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

  return {
    mockEmails,
    filteredEmails,
    selectedFilter,
    handleFilterChange,
    getCategoryIcon,
    getCategoryColor,
  };
}
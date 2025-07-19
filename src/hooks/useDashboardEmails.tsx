import { useState, useEffect } from "react";
import { EmailCategory } from "@/types/email";
type FilterType = EmailCategory | "all";
import { AlertCircle, Clock, Info, Mail, X } from "lucide-react";
import { ProcessedEmail } from "../../types/gmail";
import { supabase } from "@/lib/supabaseClient";

export function useDashboardEmails() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [emails, setEmails] = useState<ProcessedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user ID from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session?.user) {
          throw new Error('User not authenticated');
        }

        // Fetch processed emails from the API route
        const response = await fetch('/api/emails', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch emails');
        }

        const data = await response.json();
        setEmails(data.emails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch emails');
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();

    // Set up a 30-second refresh interval
    const refreshInterval = setInterval(fetchEmails, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  const filteredEmails = emails.filter((email) => {
    if (selectedFilter === 'all') return true;
    return email.classification.category === selectedFilter;
  });

  const handleFilterChange = (value: FilterType) => {
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
    emails,
    filteredEmails,
    selectedFilter,
    handleFilterChange,
    getCategoryIcon,
    getCategoryColor,
    loading,
    error
  };
}

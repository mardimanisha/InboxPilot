import { EmailCategory } from "@/types/email";

export const mockEmails = [
  {
    id: 1,
    sender: "CEO Office",
    subject: "Quarterly Review Meeting - Action Required",
    time: "2 hours ago",
    preview:
      "Please prepare your department's Q4 report for tomorrow's meeting...",
    unread: true,
    category: "urgent" as EmailCategory,
  },
  {
    id: 2,
    sender: "Client Services",
    subject: "URGENT: Server Downtime Issue",
    time: "4 hours ago",
    preview: "We're experiencing critical issues with the production server...",
    unread: true,
    category: "urgent" as EmailCategory,
  },
  {
    id: 3,
    sender: "HR Department",
    subject: "Complete Your Annual Performance Review",
    time: "1 day ago",
    preview: "Your annual performance review is due by end of week...",
    unread: false,
    category: "actionNeeded" as EmailCategory,
  },
  {
    id: 4,
    sender: "Finance Team",
    subject: "Expense Report Approval Needed",
    time: "2 days ago",
    preview: "Please review and approve the attached expense reports...",
    unread: true,
    category: "actionNeeded" as EmailCategory,
  },
  {
    id: 5,
    sender: "Project Manager",
    subject: "Project Timeline Update Required",
    time: "3 days ago",
    preview:
      "We need to update the project timeline for the client presentation...",
    unread: false,
    category: "actionNeeded" as EmailCategory,
  },
  {
    id: 6,
    sender: "Company Newsletter",
    subject: "Weekly Company Updates",
    time: "1 day ago",
    preview:
      "This week's highlights include new team members and upcoming events...",
    unread: false,
    category: "fyi" as EmailCategory,
  },
  {
    id: 7,
    sender: "IT Department",
    subject: "System Maintenance Scheduled",
    time: "2 days ago",
    preview: "Scheduled maintenance will occur this weekend from 2-4 AM...",
    unread: false,
    category: "fyi" as EmailCategory,
  },
  {
    id: 8,
    sender: "Marketing Promotions",
    subject: "50% Off Sale - Limited Time",
    time: "3 days ago",
    preview: "Don't miss out on our biggest sale of the year...",
    unread: false,
    category: "ignore" as EmailCategory,
  },
];
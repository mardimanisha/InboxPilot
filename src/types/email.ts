export type EmailCategory = "urgent" | "actionNeeded" | "fyi" | "ignore";

export interface Email {
  id: number;
  sender: string;
  subject: string;
  time: string;
  preview: string;
  unread: boolean;
  category: EmailCategory;
}
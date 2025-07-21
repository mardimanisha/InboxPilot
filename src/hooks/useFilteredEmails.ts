import { Email } from "@/types/email";

export const useFilteredEmails = (emails: Email[], category: string) => {
  if (category === "all") return emails;
  return emails.filter((email) => email.category === category);
};

# User Flow – InboxPilot (AI Email & Task Prioritizer)

## Overview
This document outlines the end-to-end user flow for InboxPilot – an AI-powered assistant that classifies emails, suggests replies, extracts tasks, and sends a daily digest to help busy professionals manage communication overload.

---

## 1. Onboarding Flow

### 1.1 Landing Page
- User sees product value proposition
- CTA: "Get Started with Google"

### 1.2 Google OAuth Consent
- Redirected to Google OAuth screen
- Permissions requested:
  - Read emails
  - Compose draft replies
  - Modify labels (optional)

### 1.3 Account Setup
- OAuth success → Welcome screen
- Show loading spinner: “Scanning your inbox...”

---

## 2. Initial Email Scan & Classification

### 2.1 Email Sync
- System fetches latest 100 emails
- Emails are classified into:
  - Urgent
  - Action Needed
  - FYI
  - Ignore

### 2.2 Store in Supabase DB
- Email metadata + classification stored

### 2.3 Redirect to Dashboard
- CTA: “View Prioritized Inbox”

---

## 3. Prioritized Inbox Dashboard

### 3.1 Categorized Tabs
- Tabs for:
  - Urgent
  - Action Needed
  - FYI
  - All
- Default: "Urgent"

### 3.2 Email Card
- Sender, Subject, Timestamp
- Tags: [Urgent], [FYI], etc.
- Actions:
  - 📝 Suggest Reply
  - ✅ Convert to Task
  - 👁️ View Email Details

---

## 4. Suggest Reply Flow

### 4.1 Click “Suggest Reply”
- API call to OpenAI → Fetch 2–3 smart replies

### 4.2 Show Reply Options
- Editable reply suggestions
- Buttons:
  - "Insert in Gmail Drafts"
  - "Copy to Clipboard"
  - "Edit & Send"

---

## 5. Convert to Task Flow

### 5.1 Click “Convert to Task”
- OpenAI extracts:
  - Task description
  - Priority
  - Due date

### 5.2 Confirm Task Details
- User can edit extracted fields

### 5.3 Save Task
- Saved to:
  - Internal task list
  - OR Notion via Zapier (if connected)

---

## 6. Daily Priority Digest

### 6.1 CRON Job – 8:00 AM Daily
- Auto-generates digest email with:
  - Top 3 emails (Urgent/Action Needed)
  - Top 3 tasks
  - Suggested plan for the day

### 6.2 Email Sent via SendGrid
- InboxPilot branded email summary

---

## 7. Task Manager View (Optional)

### 7.1 View Tasks
- List of all saved tasks
- Filters: Priority, Due Date, Source (email)

### 7.2 Mark as Done
- Checkbox to complete task
- Optional: Archive task

---

## 8. Settings & Account

### 8.1 Manage Integrations
- Connect/Disconnect Notion

### 8.2 Feedback
- Provide feedback on classifications or replies

### 8.3 Logout
- Disconnect Gmail and end session

---

## End of User Flow

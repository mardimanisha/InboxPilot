# Product Requirements Document (PRD)

## Product Name

InboxPilot (AI Email & Task Prioritizer)

## Owner

Product Manager: Manisha Mardi
Version: 1.0\
Date: July 10, 2025

---

## Overview

InboxPilot is an AI-powered assistant designed to help users manage email and task overload. It intelligently scans a user's Gmail inbox, prioritizes emails by urgency, suggests quick replies, and converts actionable emails into tasks. The tool helps professionals regain focus and reduce cognitive fatigue from overflowing inboxes and scattered task management.

---

## Problem Statement

Modern professionals are buried under email and task noise. Important messages are lost, response time suffers, and actionable items often slip through the cracks.

---

## Goals & Objectives

- Reduce the time spent managing emails.
- Surface only the most important communications.
- Help users respond and act faster.
- Integrate task management seamlessly from within email workflows.

---

## Target Users

- Freelancers and solopreneurs
- Client-facing professionals (sales, consultants, marketers)
- Startup founders and executives

---

## Success Metrics

- > 70% of users interact with the daily digest.
- > 30% faster average email response time.
- > 50% of users create tasks from email weekly.
- User retention rate >40% after 30 days.

---

## Features

### 1. Smart Email Prioritizer

**Description**: AI categorizes emails into: Urgent, Action Needed, FYI, or Ignore.
**User Benefit**: Cuts through clutter, identifies what matters now.
**Tech Stack**:

- Gmail API (OAuth, read-only access)
- GPT-4 prompt to classify based on sender, content, urgency
- Supabase/Postgres to store categorized emails

### 2. AI Reply Suggestions

**Description**: Generates 2–3 reply options for emails.
**User Benefit**: Saves time replying, especially for repetitive or client-facing tasks.
**Tech Stack**:

- OpenAI GPT-4 for generating replies
- Option to send via Gmail API (insert into draft or compose)

### 3. Convert Email to Task

**Description**: Extracts action item, due date, and priority from an email.
**User Benefit**: Instantly turns communication into accountability.
**Tech Stack**:

- GPT-4 prompt to extract task JSON
- Task saved to local DB or pushed to Notion via Zapier

### 4. Daily Priority Digest

**Description**: 8AM summary email containing top 3 emails and 3 tasks + suggested plan.
**User Benefit**: Daily clarity and focus in under 1 minute.
**Tech Stack**:

- Backend CRON job
- GPT summary and plan prompt
- Email delivery via SendGrid

### 5. Optional (v2): AI Email Summarizer

**Description**: Generate TL;DR for long threads.
**User Benefit**: Quickly understand long or complex threads.

---

## Non-Goals (v1)

- No full inbox client or mail app replacement
- No custom NLP models (OpenAI will be used exclusively)
- No direct calendar booking or scheduling

---

## User Journey

1. **User signs up** → Connects Gmail via OAuth.
2. **System fetches last 100 emails** → Runs classification and stores results.
3. **Dashboard shows categorized emails** → User filters and sees urgent items.
4. **User clicks "Suggest Reply"** → AI response shown and editable.
5. **User clicks "Convert to Task"** → Task saved to inbox or Notion.
6. **Next morning** → Daily digest email sent with priorities and tasks.

---

## Technical Architecture (High-Level)

- **Frontend**: Next.js + TailwindCSS + Google Auth
- **Backend**: Node.js + Supabase/Postgres
- **AI Integration**: OpenAI GPT-4 endpoints (chat & completion)
- **Email**: Gmail API (read access, insert drafts)
- **Task Management**: Internal DB + Zapier/Notion API
- **Notifications**: SendGrid or Mailgun for digests

---

## Risks & Mitigations

| Risk                           | Mitigation                                      |
| ------------------------------ | ----------------------------------------------- |
| Gmail API quota limits         | Efficient polling + batch processing            |
| Incorrect AI classification    | Add manual override + feedback loop             |
| Privacy/security of email data | End-to-end encryption, data access transparency |

---

## Appendix

**OpenAI Prompts**: Stored in prompt library (task extractor, email classifier, replier).\
**Gmail Scopes**: `https://www.googleapis.com/auth/gmail.readonly`, `.../gmail.modify`, `.../gmail.compose`

---


# InboxPilot – Full Stack Development Document

---

## 1. Core Engineering Principles

### ✅ DRY (Don't Repeat Yourself)
- Common utility logic isolated in `utils/`.
- Services abstract shared logic for AI prompts, email sync, tasks.

### ✅ SRP (Single Responsibility Principle)
- Each module/service handles one job.
- Controllers = routing + validation.
- Services = business logic.
- Models = ORM + DB schema mapping.

### ✅ Separation of Concerns
- Routes → Controllers → Services → Repos → DB
- UI state vs server data handled distinctly (e.g., Zustand or React Query).

---

## 2. System Architecture

```
 ┌───────────────┐    ┌───────────────┐    ┌────────────────────┐
 │   Frontend    │ ◄─►│  Backend API  │ ◄─►│    External APIs    │
 │  (Next.js)    │    │  (Node.js)    │    │ (OpenAI, Gmail etc.)│
 └───────────────┘    └───────────────┘    └────────────────────┘
        │                    │                      │
        ▼                    ▼                      ▼
 ┌───────────────┐    ┌───────────────┐      ┌───────────────┐
 │ Supabase DB   │    │ Redis Queue   │      │ SendGrid Mail │
 └───────────────┘    └───────────────┘      └───────────────┘
```

---

## 3. Folder Structure

### Backend
```
src/
├── config/
├── controllers/
├── services/
├── routes/
├── models/
├── middleware/
├── utils/
├── jobs/
└── app.js
```

### Frontend
```
src/
├── components/
├── hooks/
├── pages/
├── services/
├── store/
└── utils/
```

---

## 4. Supabase Schema (Unified)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    profile_data JSONB,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    gmail_id VARCHAR(255) NOT NULL,
    thread_id VARCHAR(255),
    subject TEXT,
    sender_email VARCHAR(255),
    sender_name VARCHAR(255),
    recipient_email VARCHAR(255),
    body_plain TEXT,
    body_html TEXT,
    received_at TIMESTAMP,
    labels TEXT[],
    classification_id UUID REFERENCES classifications(id),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, gmail_id)
);

CREATE TABLE classifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
    category VARCHAR(50),
    confidence_score DECIMAL(3,2),
    reasoning TEXT,
    ai_model VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email_id UUID REFERENCES emails(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    priority VARCHAR(20),
    due_date DATE,
    status VARCHAR(20) DEFAULT 'pending',
    notion_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE daily_digests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    digest_date DATE NOT NULL,
    urgent_emails JSONB,
    action_needed_emails JSONB,
    tasks JSONB,
    suggested_plan TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, digest_date)
);
```

---

## 5. API Design (RESTful)

```
POST   /auth/google
POST   /auth/refresh
GET    /emails
GET    /emails/:id
POST   /emails/:id/classify
POST   /emails/:id/replies
POST   /emails/:id/tasks
GET    /tasks
POST   /tasks
PUT    /tasks/:id
DELETE /tasks/:id
GET    /digest/preview
POST   /digest/send
```

---

## 6. AI Service Layer

- `/services/ai/classifier.service.js`
- `/services/ai/task-extractor.service.js`
- `/services/ai/reply.service.js`

Uses OpenAI with prompt templates for:
- Email classification
- Task extraction
- Reply suggestions

---

## 7. Queue System (Redis + Bull)

- Email Sync Queue
- Classification Queue
- Daily Digest Queue

---

## 8. Security

- JWT Auth middleware
- Token encryption with AES
- Google OAuth 2.0
- Scopes: Gmail Readonly, Compose, Modify

---

## 9. Daily Digest

- CRON job at 8 AM
- Uses OpenAI to summarize top 3 urgent emails & tasks
- Sent via SendGrid

---

## 10. Testing Strategy

- Unit tests for classifiers, task extraction
- Integration tests for `/emails` and `/tasks` endpoints
- Mock Gmail/OpenAI/Supabase in CI

---

## 11. Deployment Checklist

- [x] Environment variables configured
- [x] Supabase schema migrated
- [x] Background workers running
- [x] Queue system healthy
- [x] Health endpoint active
- [x] Daily digest working
- [x] Logging enabled

---

## 12. Monitoring & Logging

- Winston logger
- Health endpoint: `/health`
- Metrics tracking: AI usage, queue failure, response time

---

**Author**: InboxPilot Engineering Team  
**Version**: 1.0  
**Date**: July 16, 2025

# InboxPilot System Design & Optimization

## Overview

InboxPilot is a full-stack application that uses a monorepo structure with a frontend in Next.js/React and a backend in Node.js with Supabase as the backend-as-a-service. The system is built with clean separation of concerns, type safety via TypeScript, and Google OAuth for authentication.

---

## Folder Structure

```
InboxPilot/
├── backend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/ (consider renaming to controllers/)
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── repository/  <-- NEW (suggested layer)
├── src/ (frontend)
│   ├── components/
│   ├── contexts/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   │   ├── auth/
│   │   └── onboarding/
│   ├── services/
│   ├── types/
│   └── utils/
└── public/
```

---

## User Flow Architecture

### Authentication & Onboarding

1. **Entry Point**: `/pages/auth/SignIn.tsx`
2. **Authentication**: SignIn.tsx → AuthContext → AuthService → Supabase
3. **Post-Authentication**: Session management → Protected routes via AuthGuard → Onboarding flow

---

## Data Flow

### Authentication Flow

```
SignIn.tsx → AuthContext → AuthService → Supabase
```

### Session Management

```
Supabase → AuthContext → Components (via useAuth)
```

### Error Handling

```
AuthService → AuthContext → UI Components
```

---

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Node.js, TypeScript
- **Database**: Supabase
- **Authentication**: Google OAuth (via Supabase)
- **State Management**: React Context API (suggestion: switch to Zustand if scaling)

---

## Security Features

- Google OAuth with proper scopes
- Protected routes via AuthGuard
- Session persistence and error logging
- Type-safe interactions via TypeScript

---

## System Design Diagram (Logical)

```
          ┌────────────────────┐
          │    Frontend (Next) │
          │ - SignIn.tsx       │
          │ - useAuth / Context│
          │ - AuthGuard        │
          └────────┬───────────┘
                   ↓
          ┌────────────────────┐
          │ Backend (Node.js)  │
          │ - AuthService      │
          │ - AuthMiddleware   │
          │ - Routes (/auth)   │
          └────────┬───────────┘
                   ↓
          ┌────────────────────┐
          │   Supabase (BaaS)  │
          │ - Google OAuth     │
          │ - Database (RLS)   │
          │ - Session Mgmt     │
          └────────────────────┘
```

---

## Optimization Recommendations

### ✅ Folder Structure

- Rename `components/` (in backend) to `controllers/`
- Add `repository/` for Supabase queries

### ✅ API Gateway

- Add abstraction between frontend and Supabase
- Helps future migration from Supabase if needed

### ✅ State Management

- Consider Zustand or Jotai to improve reactivity and reduce context re-renders

### ✅ Session Storage

- Use `localStorage` or `secure cookies` with encryption to persist sessions

### ✅ Security Enhancements

- Enable Supabase **RLS (Row Level Security)**
- Token rotation for Supabase sessions
- Use CSRF protection if moving to cookies

### ✅ Observability

- Integrate **Sentry** for full-stack error tracking
- Use Winston for backend logging
- Add `/healthz` endpoint for uptime monitoring

### ✅ Testing Strategy

- Unit tests for services and context
- Integration tests (e.g., `msw` or `jest` + `supertest`)
- End-to-End testing via Cypress/Playwright

---

## Future Scalability Plan

| Area                 | Suggestions                                                   |
| -------------------- | ------------------------------------------------------------- |
| Database             | Migrate to Postgres + Prisma (if Supabase limits flexibility) |
| Auth Flow            | Create custom JWT service with refresh token handling         |
| Caching              | Use Redis for session/token/onboarding caching                |
| File Handling        | Integrate Supabase Storage or AWS S3                          |
| Multi-Tenant Support | Add `tenant_id` and use RLS policies                          |
| Real-Time Features   | Use Supabase Realtime or Socket.IO                            |

---

## Summary

**What’s Good:**

- Clean monorepo and architecture
- Secure auth using Supabase
- Type-safe and modular components

**Optimizations Needed:**

- Add backend repo/controller layers
- Improve session and state management
- Implement full logging + testing strategy
- Prepare for future scalability (multi-tenancy, caching, migrations)

---

Would recommend scheduling tech debt sprints to implement each optimization in phases, starting with logging, session handling, and repository layer.

---


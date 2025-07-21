# InboxPilot Backend Guidelines & Architecture

## 1. System Architecture Overview

### 1.1 High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   External      │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   Services      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                    ┌─────────────────┐    ┌─────────────────┐
                    │   Database      │    │   Queue System  │
                    │   (Supabase)    │    │   (Redis/Bull)  │
                    └─────────────────┘    └─────────────────┘
```

### 1.2 Core Components
- **API Gateway**: Authentication, rate limiting, request routing
- **Email Service**: Gmail API integration, email processing
- **AI Service**: OpenAI GPT-4 integration for classification and replies
- **Task Service**: Task extraction and management
- **Notification Service**: Daily digest generation and delivery
- **Queue System**: Background job processing

---

## 2. Project Structure

```
src/
├── config/
│   ├── database.js
│   ├── gmail.js
│   ├── openai.js
│   ├── redis.js
│   └── environment.js
├── controllers/
│   ├── auth.controller.js
│   ├── email.controller.js
│   ├── task.controller.js
│   └── user.controller.js
├── services/
│   ├── ai/
│   │   ├── classifier.service.js
│   │   ├── reply.service.js
│   │   └── task-extractor.service.js
│   ├── email/
│   │   ├── gmail.service.js
│   │   ├── processor.service.js
│   │   └── sync.service.js
│   ├── task/
│   │   ├── task.service.js
│   │   └── notion.service.js
│   ├── notification/
│   │   ├── digest.service.js
│   │   └── email.service.js
│   └── queue/
│       ├── email-sync.queue.js
│       ├── classification.queue.js
│       └── digest.queue.js
├── models/
│   ├── User.js
│   ├── Email.js
│   ├── Task.js
│   └── Classification.js
├── middleware/
│   ├── auth.middleware.js
│   ├── rateLimiter.middleware.js
│   ├── validation.middleware.js
│   └── error.middleware.js
├── routes/
│   ├── auth.routes.js
│   ├── email.routes.js
│   ├── task.routes.js
│   └── user.routes.js
├── utils/
│   ├── logger.js
│   ├── encryption.js
│   └── validators.js
├── jobs/
│   ├── email-sync.job.js
│   ├── classification.job.js
│   └── daily-digest.job.js
└── app.js
```

---

## 3. Database Schema Design

### 3.1 Core Tables

```sql
-- Users table
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

-- Emails table
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

-- Classifications table
CREATE TABLE classifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'urgent', 'action_needed', 'fyi', 'ignore'
    confidence_score DECIMAL(3,2),
    reasoning TEXT,
    ai_model VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email_id UUID REFERENCES emails(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
    due_date DATE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
    notion_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Reply suggestions table
CREATE TABLE reply_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
    suggestion_text TEXT NOT NULL,
    tone VARCHAR(50), -- 'professional', 'casual', 'formal'
    confidence_score DECIMAL(3,2),
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Daily digests table
CREATE TABLE daily_digests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    digest_date DATE NOT NULL,
    urgent_emails JSONB,
    action_needed_emails JSONB,
    tasks JSONB,
    suggested_plan TEXT,
    sent_at TIMESTAMP,
    opened_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, digest_date)
);
```

### 3.2 Indexes for Performance

```sql
-- User-based queries
CREATE INDEX idx_emails_user_id ON emails(user_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_classifications_category ON classifications(category);

-- Date-based queries
CREATE INDEX idx_emails_received_at ON emails(received_at);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_daily_digests_date ON daily_digests(digest_date);

-- Gmail integration
CREATE INDEX idx_emails_gmail_id ON emails(gmail_id);
CREATE INDEX idx_emails_processed_at ON emails(processed_at);
```

---

## 4. API Design Guidelines

### 4.1 RESTful API Structure

```javascript
// Base URL: https://api.inboxpilot.com/v1

// Authentication
POST   /auth/google          // Google OAuth callback
POST   /auth/refresh         // Refresh access token
DELETE /auth/logout          // Logout user

// Email Management
GET    /emails               // Get categorized emails
GET    /emails/:id           // Get specific email
POST   /emails/:id/classify  // Manually reclassify email
POST   /emails/:id/replies   // Generate reply suggestions
POST   /emails/:id/tasks     // Convert email to task

// Task Management
GET    /tasks                // Get user tasks
POST   /tasks                // Create new task
PUT    /tasks/:id            // Update task
DELETE /tasks/:id            // Delete task

// User Settings
GET    /user/profile         // Get user profile
PUT    /user/settings        // Update user settings
POST   /user/sync            // Trigger manual email sync

// Daily Digest
GET    /digest/preview       // Preview today's digest
POST   /digest/send          // Send digest manually
```

### 4.2 Request/Response Standards

```javascript
// Standard Response Format
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2025-07-14T10:30:00Z",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasNext": true
  }
}

// Error Response Format
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  },
  "timestamp": "2025-07-14T10:30:00Z"
}
```

---

## 5. Service Layer Architecture

### 5.1 Gmail Service

```javascript
// services/email/gmail.service.js
class GmailService {
  constructor(userTokens) {
    this.auth = this.setupGoogleAuth(userTokens);
  }

  async fetchEmails(query = '', maxResults = 100) {
    // Implementation with proper error handling
    // Token refresh logic
    // Rate limiting considerations
  }

  async getEmailDetails(messageId) {
    // Fetch full email content
    // Parse headers and body
    // Handle attachments if needed
  }

  async createDraft(emailData) {
    // Create draft in Gmail
    // Handle formatting
  }
}
```

### 5.2 AI Classification Service

```javascript
// services/ai/classifier.service.js
class ClassifierService {
  async classifyEmail(emailData) {
    const prompt = this.buildClassificationPrompt(emailData);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 150
    });

    return this.parseClassificationResponse(response);
  }

  buildClassificationPrompt(emailData) {
    return `
      Classify this email into one of these categories:
      - urgent: Requires immediate attention
      - action_needed: Requires response or action
      - fyi: Informational, no action needed
      - ignore: Low priority, can be ignored
      
      Email details:
      Subject: ${emailData.subject}
      Sender: ${emailData.sender}
      Body: ${emailData.body.substring(0, 1000)}
      
      Respond with JSON: {"category": "urgent", "confidence": 0.85, "reasoning": "..."}
    `;
  }
}
```

### 5.3 Task Extraction Service

```javascript
// services/ai/task-extractor.service.js
class TaskExtractorService {
  async extractTask(emailData) {
    const prompt = this.buildTaskExtractionPrompt(emailData);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 200
    });

    return this.parseTaskResponse(response);
  }

  buildTaskExtractionPrompt(emailData) {
    return `
      Extract actionable tasks from this email:
      
      Subject: ${emailData.subject}
      Body: ${emailData.body}
      
      Return JSON with:
      {
        "title": "Clear task title",
        "description": "Detailed description",
        "priority": "high|medium|low",
        "due_date": "YYYY-MM-DD or null",
        "estimated_time": "30 minutes"
      }
    `;
  }
}
```

---

## 6. Queue System Design

### 6.1 Queue Configuration

```javascript
// services/queue/email-sync.queue.js
const Queue = require('bull');
const emailSyncQueue = new Queue('email sync', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

// Job processor
emailSyncQueue.process('sync-user-emails', async (job) => {
  const { userId } = job.data;
  await emailSyncService.syncUserEmails(userId);
});
```

### 6.2 Background Jobs

```javascript
// jobs/daily-digest.job.js
class DailyDigestJob {
  async execute() {
    const users = await User.findAll({ where: { active: true } });
    
    for (const user of users) {
      await digestQueue.add('generate-digest', {
        userId: user.id,
        date: new Date().toISOString().split('T')[0]
      });
    }
  }
}

// Schedule daily at 8 AM
cron.schedule('0 8 * * *', () => {
  new DailyDigestJob().execute();
});
```

---

## 7. Security & Privacy Guidelines

### 7.1 Data Protection

```javascript
// utils/encryption.js
const crypto = require('crypto');

class EncryptionService {
  static encrypt(text) {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key);
    // Implementation details
  }

  static decrypt(encryptedData) {
    // Decryption implementation
  }
}
```

### 7.2 Authentication Middleware

```javascript
// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
```

---

## 8. Error Handling & Logging

### 8.1 Global Error Handler

```javascript
// middleware/error.middleware.js
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err);

  // Gmail API errors
  if (err.code === 401) {
    error = new ErrorResponse('Token expired', 401);
  }

  // OpenAI API errors
  if (err.type === 'insufficient_quota') {
    error = new ErrorResponse('AI service unavailable', 503);
  }

  // Database errors
  if (err.code === '23505') {
    error = new ErrorResponse('Duplicate entry', 409);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.code,
      message: error.message
    }
  });
};
```

### 8.2 Structured Logging

```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'inboxpilot-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

## 9. Performance Optimization

### 9.1 Database Optimization

```javascript
// Batch processing for email classification
const batchClassifyEmails = async (emails) => {
  const batchSize = 10;
  const results = [];

  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    const classifications = await Promise.all(
      batch.map(email => classifierService.classifyEmail(email))
    );
    results.push(...classifications);
  }

  return results;
};
```

### 9.2 Caching Strategy

```javascript
// Redis caching for frequently accessed data
const redis = require('redis');
const client = redis.createClient();

const getCachedEmails = async (userId) => {
  const cacheKey = `user:${userId}:emails`;
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }

  const emails = await Email.findAll({ where: { userId } });
  await client.setex(cacheKey, 300, JSON.stringify(emails)); // 5 min cache
  
  return emails;
};
```

---

## 10. Testing Guidelines

### 10.1 Unit Tests

```javascript
// tests/services/classifier.test.js
const { ClassifierService } = require('../../services/ai/classifier.service');

describe('ClassifierService', () => {
  let classifierService;

  beforeEach(() => {
    classifierService = new ClassifierService();
  });

  test('should classify urgent email correctly', async () => {
    const emailData = {
      subject: 'URGENT: Server down',
      sender: 'alerts@company.com',
      body: 'Production server is experiencing issues'
    };

    const result = await classifierService.classifyEmail(emailData);
    
    expect(result.category).toBe('urgent');
    expect(result.confidence).toBeGreaterThan(0.8);
  });
});
```

### 10.2 Integration Tests

```javascript
// tests/integration/email.integration.test.js
describe('Email API Integration', () => {
  test('should fetch and classify emails', async () => {
    const response = await request(app)
      .get('/api/v1/emails')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBeGreaterThan(0);
  });
});
```

---

## 11. Deployment & Monitoring

### 11.1 Health Checks

```javascript
// routes/health.routes.js
router.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabaseHealth(),
      redis: await checkRedisHealth(),
      openai: await checkOpenAIHealth(),
      gmail: await checkGmailAPIHealth()
    }
  };

  const isHealthy = Object.values(health.services).every(service => service.status === 'healthy');
  
  res.status(isHealthy ? 200 : 503).json(health);
});
```

### 11.2 Monitoring & Alerts

```javascript
// utils/monitoring.js
class MonitoringService {
  static trackAPIUsage(endpoint, responseTime, statusCode) {
    // Send metrics to monitoring service
  }

  static alertOnHighErrorRate(errorRate) {
    if (errorRate > 0.05) {
      // Send alert to team
    }
  }
}
```

---

## 12. Environment Configuration

### 12.1 Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/inboxpilot
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# External APIs
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-api-key

# Queue & Cache
REDIS_URL=redis://localhost:6379

# Email Service
SENDGRID_API_KEY=your-sendgrid-api-key

# Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key

# App Configuration
NODE_ENV=production
PORT=3000
API_VERSION=v1
```

---

## 13. Deployment Checklist

### 13.1 Pre-deployment
- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Health checks passing
- [ ] Queue workers running
- [ ] Monitoring configured

### 13.2 Post-deployment
- [ ] API endpoints responding
- [ ] Background jobs processing
- [ ] Email sync working
- [ ] Daily digest scheduled
- [ ] Error monitoring active
- [ ] Performance metrics baseline established

---

This backend architecture provides a solid foundation for InboxPilot with proper separation of concerns, scalability considerations, and robust error handling. The modular design allows for easy testing, maintenance, and future enhancements.
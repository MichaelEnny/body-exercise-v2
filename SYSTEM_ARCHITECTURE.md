# FitPlatform System Architecture Document

**Version:** 1.0  
**Document Date:** August 2025  
**Last Updated:** August 2025  

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [High-Level Architecture Overview](#high-level-architecture-overview)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend API Design](#backend-api-design)
5. [Database Architecture](#database-architecture)
6. [Third-Party Integration Architecture](#third-party-integration-architecture)
7. [Security & Compliance Framework](#security--compliance-framework)
8. [Scalability & Performance Considerations](#scalability--performance-considerations)
9. [Deployment & Infrastructure](#deployment--infrastructure)
10. [Monitoring & Observability](#monitoring--observability)
11. [Development & Testing Strategy](#development--testing-strategy)

---

## Executive Summary

FitPlatform is a comprehensive fitness web application built on a modern, scalable architecture using Next.js 14+, Supabase, and Vercel. The system is designed to handle 10,000+ users with real-time data synchronization, third-party integrations, and a multi-tier subscription model.

### Key Architectural Decisions
- **Full-Stack Next.js**: Unified frontend and API layer for optimal performance
- **Supabase BaaS**: PostgreSQL database, authentication, and real-time capabilities
- **Vercel Hosting**: Edge-optimized deployment with global CDN
- **Event-Driven Architecture**: Asynchronous processing for data sync and notifications
- **Microservices Pattern**: Modular API design for maintainability and scaling

---

## High-Level Architecture Overview

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Application<br/>Next.js 14+]
        PWA[Mobile PWA<br/>Next.js 14+]
        TRAINER[Trainer Portal<br/>Next.js 14+]
    end
    
    subgraph "Edge Layer"
        CDN[Vercel Edge Network<br/>Global CDN]
        EDGE[Edge Functions<br/>Middleware & Auth]
    end
    
    subgraph "Application Layer"
        API[Next.js API Routes<br/>Server-Side Logic]
        WH[Webhook Handlers<br/>Stripe & External APIs]
    end
    
    subgraph "Backend Services"
        SUPABASE[Supabase<br/>PostgreSQL + Auth + Storage]
        REDIS[Redis Cache<br/>Session & Data Caching]
        QUEUE[Message Queue<br/>Background Jobs]
    end
    
    subgraph "External Services"
        STRIPE[Stripe<br/>Payments & Subscriptions]
        HEALTH[Apple HealthKit<br/>iOS Health Data]
        GFIT[Google Fit<br/>Android Health Data]
        STRAVA[Strava API<br/>Activity Sync]
        EMAIL[Resend<br/>Email Service]
    end
    
    WEB --> CDN
    PWA --> CDN
    TRAINER --> CDN
    CDN --> EDGE
    EDGE --> API
    API --> SUPABASE
    API --> REDIS
    API --> QUEUE
    WH --> STRIPE
    API --> HEALTH
    API --> GFIT
    API --> STRAVA
    API --> EMAIL
```

### Core Components

1. **Client Applications**: Next.js-based web app, PWA, and trainer portal
2. **Edge Infrastructure**: Vercel's global CDN and edge functions
3. **API Layer**: RESTful APIs with GraphQL for complex queries
4. **Database Layer**: PostgreSQL with Redis caching
5. **Integration Layer**: Third-party API connectors and webhooks
6. **Infrastructure**: Vercel hosting with monitoring and analytics

---

## Frontend Architecture

### Technology Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: Zustand for client state
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization
- **Real-time**: Supabase Realtime subscriptions

### Application Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Main application
│   ├── (trainer)/         # Trainer-specific routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn)
│   ├── forms/            # Form components
│   ├── charts/           # Chart components
│   └── layouts/          # Layout components
├── lib/                  # Utility libraries
│   ├── supabase/         # Supabase client
│   ├── auth/             # Authentication utilities
│   ├── integrations/     # Third-party integrations
│   └── utils/            # Helper functions
├── hooks/                # Custom React hooks
├── stores/               # Zustand stores
├── types/                # TypeScript definitions
└── constants/            # Application constants
```

### State Management Strategy

```typescript
// User store example
interface UserStore {
  user: User | null;
  profile: UserProfile | null;
  subscription: Subscription | null;
  setUser: (user: User) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  logout: () => void;
}

// Workout store example
interface WorkoutStore {
  workouts: Workout[];
  activeWorkout: WorkoutSession | null;
  progress: ProgressData[];
  loadWorkouts: () => Promise<void>;
  startWorkout: (workoutId: string) => void;
  completeWorkout: (data: WorkoutData) => Promise<void>;
}
```

---

## Backend API Design

### API Architecture Principles
- RESTful design with consistent naming conventions
- Proper HTTP status codes and error handling
- API versioning strategy (v1, v2, etc.)
- Request/response validation with Zod schemas
- Rate limiting and authentication middleware

### Core API Endpoints

#### Authentication APIs
```typescript
// /api/auth/signup
POST /api/auth/signup
Body: { email: string, password: string, profile: UserProfile }
Response: { user: User, session: Session }

// /api/auth/login
POST /api/auth/login
Body: { email: string, password: string }
Response: { user: User, session: Session }

// /api/auth/refresh
POST /api/auth/refresh
Body: { refreshToken: string }
Response: { accessToken: string, refreshToken: string }
```

#### Workout Management APIs
```typescript
// /api/workouts
GET /api/workouts?page=1&limit=20&category=strength
Response: { workouts: Workout[], pagination: PaginationMeta }

POST /api/workouts
Body: { name: string, exercises: Exercise[], category: string }
Response: { workout: Workout }

PUT /api/workouts/[id]
Body: { name?: string, exercises?: Exercise[] }
Response: { workout: Workout }

DELETE /api/workouts/[id]
Response: { success: boolean }
```

#### Progress Tracking APIs
```typescript
// /api/sessions
POST /api/sessions
Body: { workoutId: string, exercises: ExercisePerformance[] }
Response: { session: WorkoutSession }

GET /api/progress?period=30d&metric=weight
Response: { data: ProgressPoint[], summary: ProgressSummary }

GET /api/analytics/dashboard
Response: { 
  workoutCount: number,
  totalTime: number,
  averageIntensity: number,
  trends: TrendData[]
}
```

#### Integration APIs
```typescript
// /api/integrations/healthkit
POST /api/integrations/healthkit/sync
Body: { data: HealthKitData[] }
Response: { synced: number, errors: SyncError[] }

// /api/integrations/strava
GET /api/integrations/strava/activities?after=timestamp
Response: { activities: StravaActivity[] }

POST /api/integrations/strava/webhook
Body: StravaWebhookPayload
Response: { success: boolean }
```

### API Middleware Stack

```typescript
// Middleware pipeline
export default async function apiHandler(req: NextRequest) {
  // 1. CORS handling
  if (req.method === 'OPTIONS') {
    return handleCORS(req);
  }
  
  // 2. Rate limiting
  await rateLimiter.check(req);
  
  // 3. Authentication
  const user = await authenticateUser(req);
  
  // 4. Authorization
  await authorizeRequest(req, user);
  
  // 5. Request validation
  const validatedData = await validateRequest(req);
  
  // 6. Business logic
  const result = await handleRequest(validatedData);
  
  // 7. Response formatting
  return formatResponse(result);
}
```

---

## Database Architecture

### PostgreSQL Schema Design

#### Core Tables

```sql
-- Users table with profile data
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  encrypted_password VARCHAR(255),
  email_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Profile information
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  gender VARCHAR(20),
  height_cm INTEGER,
  weight_kg DECIMAL(5,2),
  activity_level INTEGER CHECK (activity_level BETWEEN 1 AND 5),
  
  -- Subscription info
  subscription_tier VARCHAR(20) DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  
  -- User preferences
  preferred_units VARCHAR(10) DEFAULT 'metric',
  timezone VARCHAR(50) DEFAULT 'UTC',
  privacy_settings JSONB DEFAULT '{}',
  
  -- Audit fields
  last_sign_in_at TIMESTAMPTZ,
  sign_in_count INTEGER DEFAULT 0
);

-- Workouts table
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  estimated_duration_minutes INTEGER,
  
  -- Exercise data
  exercises JSONB NOT NULL DEFAULT '[]',
  equipment_needed TEXT[],
  muscle_groups TEXT[],
  
  -- Metadata
  is_template BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', name || ' ' || COALESCE(description, ''))
  ) STORED
);

-- Workout sessions (completed workouts)
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
  
  -- Session timing
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  
  -- Performance data
  exercises_completed JSONB DEFAULT '[]',
  total_volume_kg DECIMAL(10,2),
  calories_burned INTEGER,
  average_heart_rate INTEGER,
  max_heart_rate INTEGER,
  
  -- Session metadata
  notes TEXT,
  mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 5),
  perceived_exertion INTEGER CHECK (perceived_exertion BETWEEN 1 AND 10),
  
  -- Data source
  data_source VARCHAR(50) DEFAULT 'manual',
  sync_id VARCHAR(100),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Device integrations
CREATE TABLE device_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'healthkit', 'googlefit', 'strava'
  
  -- OAuth tokens (encrypted)
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  
  -- Integration metadata
  provider_user_id VARCHAR(200),
  scopes TEXT[],
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ,
  sync_enabled BOOLEAN DEFAULT true,
  
  -- Sync settings
  sync_frequency_hours INTEGER DEFAULT 24,
  data_types_to_sync TEXT[] DEFAULT ARRAY['workouts', 'heart_rate'],
  
  UNIQUE(user_id, provider)
);

-- Progress tracking
CREATE TABLE progress_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Progress data
  metric_type VARCHAR(50) NOT NULL, -- 'weight', 'body_fat', 'muscle_mass'
  value DECIMAL(10,3) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  
  -- Context
  recorded_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  data_source VARCHAR(50) DEFAULT 'manual',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure reasonable constraints
  CONSTRAINT valid_metric_value CHECK (value > 0 AND value < 10000)
);

-- Trainer-client relationships (Enterprise tier)
CREATE TABLE trainer_client_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Relationship status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'active', 'paused', 'ended'
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  
  -- Permissions
  can_view_workouts BOOLEAN DEFAULT true,
  can_create_workouts BOOLEAN DEFAULT true,
  can_view_progress BOOLEAN DEFAULT true,
  can_message BOOLEAN DEFAULT true,
  
  -- Billing
  hourly_rate_cents INTEGER,
  currency VARCHAR(3) DEFAULT 'USD',
  
  UNIQUE(trainer_id, client_id)
);
```

#### Indexes for Performance

```sql
-- User-related indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_tier, subscription_expires_at);

-- Workout indexes
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_category ON workouts(category);
CREATE INDEX idx_workouts_public ON workouts(is_public) WHERE is_public = true;
CREATE INDEX idx_workouts_search ON workouts USING GIN(search_vector);

-- Session indexes
CREATE INDEX idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_started_at ON workout_sessions(started_at DESC);
CREATE INDEX idx_workout_sessions_workout_id ON workout_sessions(workout_id);

-- Integration indexes
CREATE INDEX idx_device_integrations_user_id ON device_integrations(user_id);
CREATE INDEX idx_device_integrations_provider ON device_integrations(provider);
CREATE INDEX idx_device_integrations_sync ON device_integrations(last_sync_at) 
  WHERE sync_enabled = true;

-- Progress indexes
CREATE INDEX idx_progress_entries_user_metric ON progress_entries(user_id, metric_type);
CREATE INDEX idx_progress_entries_recorded_at ON progress_entries(recorded_at DESC);

-- Trainer-client indexes
CREATE INDEX idx_trainer_client_trainer ON trainer_client_relationships(trainer_id);
CREATE INDEX idx_trainer_client_client ON trainer_client_relationships(client_id);
CREATE INDEX idx_trainer_client_status ON trainer_client_relationships(status);
```

### Data Models (TypeScript)

```typescript
// Core type definitions
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  heightCm?: number;
  weightKg?: number;
  activityLevel: 1 | 2 | 3 | 4 | 5;
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  subscriptionExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment?: string[];
  instructions?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  exercise?: Exercise;
  sets: Array<{
    reps?: number;
    weight?: number;
    duration?: number;
    distance?: number;
    restSeconds?: number;
  }>;
  notes?: string;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  estimatedDurationMinutes?: number;
  exercises: WorkoutExercise[];
  equipmentNeeded: string[];
  muscleGroups: string[];
  isTemplate: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutId?: string;
  workout?: Workout;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  exercisesCompleted: Array<{
    exerciseId: string;
    setsCompleted: Array<{
      reps?: number;
      weight?: number;
      duration?: number;
      distance?: number;
    }>;
  }>;
  totalVolumeKg?: number;
  caloriesBurned?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  notes?: string;
  moodRating?: 1 | 2 | 3 | 4 | 5;
  perceivedExertion?: number;
  dataSource: string;
  createdAt: string;
}
```

---

## Third-Party Integration Architecture

### Integration Strategy
- OAuth 2.0 flow for secure authentication
- Webhook endpoints for real-time data sync
- Rate limiting and retry mechanisms
- Data transformation and validation
- Error handling and monitoring

### Apple HealthKit Integration

```typescript
// HealthKit integration service
export class HealthKitIntegration {
  async authorize(userId: string): Promise<AuthResult> {
    // Request HealthKit permissions
    const permissions = [
      'HKWorkoutType',
      'HKQuantityTypeIdentifierHeartRate',
      'HKQuantityTypeIdentifierActiveEnergyBurned',
      'HKQuantityTypeIdentifierDistanceWalkingRunning'
    ];
    
    return await this.requestPermissions(permissions);
  }
  
  async syncWorkouts(userId: string, since?: Date): Promise<SyncResult> {
    const integration = await this.getIntegration(userId, 'healthkit');
    if (!integration?.syncEnabled) return { synced: 0, errors: [] };
    
    try {
      const workouts = await this.fetchHealthKitWorkouts(since);
      const transformed = workouts.map(this.transformWorkout);
      
      for (const workout of transformed) {
        await this.upsertWorkoutSession(userId, workout);
      }
      
      await this.updateLastSync(integration.id);
      return { synced: workouts.length, errors: [] };
    } catch (error) {
      await this.logSyncError(integration.id, error);
      throw error;
    }
  }
  
  private transformWorkout(healthKitWorkout: any): WorkoutSession {
    return {
      startedAt: healthKitWorkout.startDate,
      completedAt: healthKitWorkout.endDate,
      durationSeconds: healthKitWorkout.duration,
      caloriesBurned: healthKitWorkout.totalEnergyBurned?.doubleValue,
      dataSource: 'healthkit',
      syncId: healthKitWorkout.uuid,
      // Transform exercise data...
    };
  }
}
```

### Google Fit Integration

```typescript
export class GoogleFitIntegration {
  private readonly baseUrl = 'https://www.googleapis.com/fitness/v1';
  
  async syncActivities(userId: string, since?: Date): Promise<SyncResult> {
    const integration = await this.getIntegration(userId, 'googlefit');
    const accessToken = await this.getValidAccessToken(integration);
    
    const startTime = since?.getTime() || Date.now() - 24 * 60 * 60 * 1000;
    const endTime = Date.now();
    
    const response = await fetch(
      `${this.baseUrl}/users/me/sessions?startTime=${startTime}000000&endTime=${endTime}000000`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    if (!response.ok) {
      throw new GoogleFitError(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return this.processSessions(userId, data.session || []);
  }
  
  async setupWebhook(userId: string): Promise<void> {
    const integration = await this.getIntegration(userId, 'googlefit');
    const accessToken = await this.getValidAccessToken(integration);
    
    await fetch(`${this.baseUrl}/users/me/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        applicationName: 'FitPlatform',
        dataTypeName: 'com.google.step_count.delta',
        endpoint: `${process.env.APP_URL}/api/integrations/googlefit/webhook`
      })
    });
  }
}
```

### Strava Integration

```typescript
export class StravaIntegration {
  private readonly baseUrl = 'https://www.strava.com/api/v3';
  
  async exchangeToken(code: string): Promise<StravaTokens> {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code'
      })
    });
    
    return response.json();
  }
  
  async syncActivities(userId: string, after?: number): Promise<SyncResult> {
    const integration = await this.getIntegration(userId, 'strava');
    const accessToken = await this.refreshTokenIfNeeded(integration);
    
    const params = new URLSearchParams({
      per_page: '100',
      ...(after && { after: after.toString() })
    });
    
    const response = await this.rateLimitedRequest(
      `${this.baseUrl}/athlete/activities?${params}`,
      accessToken
    );
    
    const activities = await response.json();
    return this.processActivities(userId, activities);
  }
  
  private async rateLimitedRequest(url: string, token: string): Promise<Response> {
    // Implement Strava rate limiting (100 requests per 15 minutes)
    await this.checkRateLimit();
    
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.status === 429) {
      // Rate limited, wait and retry
      await this.wait(15 * 60 * 1000); // Wait 15 minutes
      return this.rateLimitedRequest(url, token);
    }
    
    return response;
  }
}
```

### Webhook Handlers

```typescript
// /api/integrations/strava/webhook
export async function POST(request: NextRequest) {
  const payload = await request.json();
  
  // Verify Strava webhook signature
  const signature = request.headers.get('x-strava-signature');
  if (!verifyStravaSignature(payload, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  // Process webhook event
  switch (payload.object_type) {
    case 'activity':
      await handleActivityUpdate(payload);
      break;
    case 'athlete':
      await handleAthleteUpdate(payload);
      break;
  }
  
  return NextResponse.json({ success: true });
}

async function handleActivityUpdate(payload: StravaWebhookPayload) {
  const { owner_id, object_id, aspect_type } = payload;
  
  // Find user by Strava athlete ID
  const integration = await supabase
    .from('device_integrations')
    .select('user_id')
    .eq('provider', 'strava')
    .eq('provider_user_id', owner_id.toString())
    .single();
  
  if (!integration.data) return;
  
  switch (aspect_type) {
    case 'create':
      await syncStravaActivity(integration.data.user_id, object_id);
      break;
    case 'update':
      await updateStravaActivity(integration.data.user_id, object_id);
      break;
    case 'delete':
      await deleteStravaActivity(integration.data.user_id, object_id);
      break;
  }
}
```

---

## Security & Compliance Framework

### Authentication & Authorization

#### JWT Token Strategy
```typescript
// Token configuration
export const tokenConfig = {
  accessToken: {
    expiresIn: '15m',
    algorithm: 'RS256'
  },
  refreshToken: {
    expiresIn: '7d',
    algorithm: 'HS256'
  }
};

// Token rotation middleware
export async function refreshTokenRotation(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')?.value;
  if (!refreshToken) return null;
  
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await getUserById(payload.sub);
    
    // Issue new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    // Invalidate old refresh token
    await revokeRefreshToken(refreshToken);
    
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    return null;
  }
}
```

#### Role-Based Access Control (RBAC)
```typescript
export enum Permission {
  READ_WORKOUTS = 'workouts:read',
  WRITE_WORKOUTS = 'workouts:write',
  MANAGE_CLIENTS = 'clients:manage',
  VIEW_ANALYTICS = 'analytics:view',
  ADMIN_ACCESS = 'admin:access'
}

export const rolePermissions = {
  free: [Permission.READ_WORKOUTS, Permission.WRITE_WORKOUTS],
  pro: [
    Permission.READ_WORKOUTS,
    Permission.WRITE_WORKOUTS,
    Permission.VIEW_ANALYTICS
  ],
  enterprise: [
    Permission.READ_WORKOUTS,
    Permission.WRITE_WORKOUTS,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_CLIENTS
  ],
  admin: Object.values(Permission)
};

// Authorization middleware
export function requirePermission(permission: Permission) {
  return async (request: NextRequest, user: User) => {
    const userPermissions = rolePermissions[user.subscriptionTier];
    
    if (!userPermissions.includes(permission)) {
      throw new ForbiddenError(`Missing permission: ${permission}`);
    }
    
    return true;
  };
}
```

### Data Protection & Encryption

#### Sensitive Data Encryption
```typescript
import { encrypt, decrypt } from 'crypto';

export class DataEncryption {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyBuffer = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  
  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.keyBuffer, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }
  
  decrypt(encryptedData: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipher(this.algorithm, this.keyBuffer, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Usage in integration tokens
export async function storeIntegrationTokens(
  userId: string,
  provider: string,
  tokens: OAuthTokens
) {
  const encryption = new DataEncryption();
  
  await supabase.from('device_integrations').upsert({
    user_id: userId,
    provider,
    access_token_encrypted: encryption.encrypt(tokens.accessToken),
    refresh_token_encrypted: tokens.refreshToken 
      ? encryption.encrypt(tokens.refreshToken) 
      : null,
    token_expires_at: tokens.expiresAt
  });
}
```

### GDPR & Privacy Compliance

#### Data Subject Rights Implementation
```typescript
export class PrivacyService {
  // Right to Access (Article 15)
  async exportUserData(userId: string): Promise<UserDataExport> {
    const [user, workouts, sessions, progress, integrations] = await Promise.all([
      this.getUserData(userId),
      this.getWorkoutData(userId),
      this.getSessionData(userId),
      this.getProgressData(userId),
      this.getIntegrationData(userId)
    ]);
    
    return {
      user,
      workouts,
      sessions,
      progress,
      integrations: integrations.map(this.sanitizeIntegration),
      exportedAt: new Date().toISOString()
    };
  }
  
  // Right to Rectification (Article 16)
  async updateUserData(userId: string, updates: Partial<User>): Promise<User> {
    // Validate updates
    const validatedUpdates = userUpdateSchema.parse(updates);
    
    // Update user data
    const { data, error } = await supabase
      .from('users')
      .update(validatedUpdates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw new DatabaseError(error.message);
    
    // Log data modification
    await this.logDataModification(userId, 'update', validatedUpdates);
    
    return data;
  }
  
  // Right to Erasure (Article 17)
  async deleteUserData(userId: string, reason: string): Promise<void> {
    // Begin transaction
    const { error } = await supabase.rpc('delete_user_cascade', {
      target_user_id: userId,
      deletion_reason: reason
    });
    
    if (error) throw new DatabaseError(error.message);
    
    // Log deletion
    await this.logDataDeletion(userId, reason);
    
    // Notify external services
    await this.notifyExternalServicesOfDeletion(userId);
  }
  
  // Data Portability (Article 20)
  async generateDataPortabilityExport(userId: string): Promise<string> {
    const userData = await this.exportUserData(userId);
    
    // Convert to standard format (JSON-LD)
    const structuredData = this.convertToStructuredFormat(userData);
    
    // Generate secure download URL
    const fileName = `fitplatform-export-${userId}-${Date.now()}.json`;
    const { data } = await supabase.storage
      .from('exports')
      .upload(fileName, structuredData, {
        metadata: { 'auto-delete': '7d' }
      });
    
    return data?.path || '';
  }
}
```

### Security Headers & CSP

```typescript
// Security middleware
export function securityHeaders(request: NextRequest) {
  const response = NextResponse.next();
  
  // Content Security Policy
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com",
    "frame-src https://js.stripe.com"
  ].join('; '));
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  return response;
}
```

---

## Scalability & Performance Considerations

### Caching Strategy

#### Multi-Layer Caching Architecture
```typescript
export class CacheManager {
  private redis = new Redis(process.env.REDIS_URL);
  private memoryCache = new Map();
  
  async get<T>(key: string): Promise<T | null> {
    // L1: Memory cache (fastest)
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    
    // L2: Redis cache
    const redisValue = await this.redis.get(key);
    if (redisValue) {
      const parsed = JSON.parse(redisValue);
      this.memoryCache.set(key, parsed);
      return parsed;
    }
    
    return null;
  }
  
  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    // Set in both caches
    this.memoryCache.set(key, value);
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
  
  async invalidate(pattern: string): Promise<void> {
    // Clear memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
      }
    }
    
    // Clear Redis cache
    const keys = await this.redis.keys(`*${pattern}*`);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

// Usage in API routes
export async function getCachedWorkouts(userId: string) {
  const cacheKey = `workouts:${userId}`;
  
  let workouts = await cache.get<Workout[]>(cacheKey);
  if (!workouts) {
    workouts = await fetchWorkoutsFromDB(userId);
    await cache.set(cacheKey, workouts, 1800); // 30 minutes
  }
  
  return workouts;
}
```

#### Database Optimization

```sql
-- Partitioning for workout sessions (by month)
CREATE TABLE workout_sessions_2025_01 PARTITION OF workout_sessions
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE workout_sessions_2025_02 PARTITION OF workout_sessions
FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Materialized view for user statistics
CREATE MATERIALIZED VIEW user_workout_stats AS
SELECT 
  user_id,
  COUNT(*) as total_sessions,
  SUM(duration_seconds) as total_duration,
  AVG(calories_burned) as avg_calories,
  MAX(completed_at) as last_workout,
  DATE_TRUNC('month', completed_at) as month
FROM workout_sessions
WHERE completed_at IS NOT NULL
GROUP BY user_id, DATE_TRUNC('month', completed_at);

-- Refresh strategy
CREATE OR REPLACE FUNCTION refresh_user_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_workout_stats;
END;
$$ LANGUAGE plpgsql;

-- Scheduled refresh (run nightly)
SELECT cron.schedule('refresh-stats', '0 2 * * *', 'SELECT refresh_user_stats();');
```

### Background Job Processing

```typescript
// Job queue implementation
export class JobQueue {
  private redis = new Redis(process.env.REDIS_URL);
  
  async addJob(queueName: string, jobData: any, options: JobOptions = {}) {
    const job = {
      id: generateId(),
      data: jobData,
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      delay: options.delay || 0,
      createdAt: Date.now()
    };
    
    const score = Date.now() + (options.delay || 0);
    await this.redis.zadd(`queue:${queueName}`, score, JSON.stringify(job));
    
    return job.id;
  }
  
  async processJobs(queueName: string, processor: JobProcessor) {
    while (true) {
      const jobs = await this.redis.zrangebyscore(
        `queue:${queueName}`, 
        0, 
        Date.now(), 
        'LIMIT', 0, 10
      );
      
      for (const jobData of jobs) {
        const job = JSON.parse(jobData);
        
        try {
          await processor(job.data);
          await this.redis.zrem(`queue:${queueName}`, jobData);
        } catch (error) {
          await this.handleJobError(queueName, job, error);
        }
      }
      
      await sleep(1000); // Poll every second
    }
  }
  
  private async handleJobError(queueName: string, job: any, error: Error) {
    job.attempts++;
    job.lastError = error.message;
    
    if (job.attempts >= job.maxAttempts) {
      // Move to dead letter queue
      await this.redis.lpush(`queue:${queueName}:failed`, JSON.stringify(job));
      await this.redis.zrem(`queue:${queueName}`, JSON.stringify(job));
    } else {
      // Retry with exponential backoff
      const delay = Math.pow(2, job.attempts) * 1000;
      const score = Date.now() + delay;
      await this.redis.zadd(`queue:${queueName}`, score, JSON.stringify(job));
    }
  }
}

// Background jobs
export const syncHealthDataJob = async (data: { userId: string, provider: string }) => {
  const integration = getIntegrationService(data.provider);
  await integration.syncData(data.userId);
};

export const sendWorkoutReminderJob = async (data: { userId: string, workoutId: string }) => {
  const user = await getUserById(data.userId);
  const workout = await getWorkoutById(data.workoutId);
  
  await emailService.sendWorkoutReminder(user.email, {
    userName: user.firstName,
    workoutName: workout.name,
    scheduledTime: workout.scheduledAt
  });
};

// Job scheduling
export function scheduleRecurringJobs() {
  // Sync health data every hour for active integrations
  jobQueue.addJob('health-sync', {}, { 
    repeat: { every: 60 * 60 * 1000 } 
  });
  
  // Send workout reminders
  jobQueue.addJob('workout-reminders', {}, { 
    repeat: { cron: '0 */2 * * *' } // Every 2 hours
  });
  
  // Clean up old sessions
  jobQueue.addJob('cleanup', {}, { 
    repeat: { cron: '0 3 * * *' } // Daily at 3 AM
  });
}
```

### Real-time Features with Supabase

```typescript
// Real-time subscription manager
export class RealtimeManager {
  private channels = new Map<string, RealtimeChannel>();
  
  subscribeToUserWorkouts(userId: string, callback: (payload: any) => void) {
    const channelName = `workouts:${userId}`;
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName);
    }
    
    const channel = supabase
      .channel(`workouts:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'workouts',
        filter: `user_id=eq.${userId}`
      }, callback)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'workout_sessions',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
    
    this.channels.set(channelName, channel);
    return channel;
  }
  
  subscribeToTrainerClients(trainerId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`trainer:${trainerId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'workout_sessions',
        filter: `user_id=in.(${this.getClientIds(trainerId).join(',')})`
      }, callback)
      .subscribe();
    
    return channel;
  }
  
  broadcastWorkoutUpdate(userId: string, workoutData: any) {
    const channel = this.channels.get(`workouts:${userId}`);
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'workout_updated',
        payload: workoutData
      });
    }
  }
}

// Usage in components
export function useRealtimeWorkouts(userId: string) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  
  useEffect(() => {
    const channel = realtimeManager.subscribeToUserWorkouts(userId, (payload) => {
      switch (payload.eventType) {
        case 'INSERT':
          setWorkouts(prev => [...prev, payload.new]);
          break;
        case 'UPDATE':
          setWorkouts(prev => 
            prev.map(w => w.id === payload.new.id ? payload.new : w)
          );
          break;
        case 'DELETE':
          setWorkouts(prev => prev.filter(w => w.id !== payload.old.id));
          break;
      }
    });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
  
  return workouts;
}
```

---

## Deployment & Infrastructure

### Vercel Configuration

```typescript
// vercel.json
{
  "version": 2,
  "regions": ["iad1", "sfo1", "lhr1"], // US East, West, London
  "env": {
    "SUPABASE_URL": "@supabase-url",
    "SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_KEY": "@supabase-service-key",
    "STRIPE_SECRET_KEY": "@stripe-secret-key",
    "STRIPE_WEBHOOK_SECRET": "@stripe-webhook-secret",
    "REDIS_URL": "@redis-url",
    "ENCRYPTION_KEY": "@encryption-key"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": "@stripe-publishable-key"
    }
  },
  "functions": {
    "app/api/integrations/*/webhook.js": {
      "maxDuration": 30
    },
    "app/api/sync/**.js": {
      "maxDuration": 60
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/health",
      "destination": "/api/health"
    }
  ]
}
```

### Environment Configuration

```bash
# .env.local (development)
# Database
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Caching
REDIS_URL=redis://localhost:6379

# External APIs
STRAVA_CLIENT_ID=your-strava-client-id
STRAVA_CLIENT_SECRET=your-strava-client-secret
GOOGLE_FIT_CLIENT_ID=your-google-fit-client-id
GOOGLE_FIT_CLIENT_SECRET=your-google-fit-client-secret

# Security
ENCRYPTION_KEY=your-32-byte-hex-key
JWT_SECRET=your-jwt-secret

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
VERCEL_ANALYTICS_ID=your-analytics-id
```

### Docker Configuration (for development)

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml (development)
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - redis
      - postgres

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: fitplatform
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

  deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Monitoring & Observability

### Health Checks & Monitoring

```typescript
// /api/health endpoint
export async function GET() {
  const checks = await Promise.allSettled([
    checkDatabase(),
    checkRedis(),
    checkExternalAPIs(),
    checkStorage()
  ]);
  
  const results = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    checks: {
      database: getCheckResult(checks[0]),
      redis: getCheckResult(checks[1]),
      external_apis: getCheckResult(checks[2]),
      storage: getCheckResult(checks[3])
    }
  };
  
  const isHealthy = Object.values(results.checks).every(check => check.status === 'healthy');
  results.status = isHealthy ? 'healthy' : 'unhealthy';
  
  return NextResponse.json(results, { 
    status: isHealthy ? 200 : 503 
  });
}

async function checkDatabase(): Promise<HealthCheck> {
  try {
    const start = Date.now();
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    return {
      status: 'healthy',
      responseTime: Date.now() - start,
      details: 'Database connection successful'
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      details: 'Database connection failed'
    };
  }
}
```

### Application Metrics

```typescript
// Metrics collection
export class MetricsCollector {
  private metrics = new Map<string, number>();
  
  increment(metric: string, value: number = 1, tags: Record<string, string> = {}) {
    const key = this.buildKey(metric, tags);
    this.metrics.set(key, (this.metrics.get(key) || 0) + value);
  }
  
  timing(metric: string, duration: number, tags: Record<string, string> = {}) {
    const key = this.buildKey(metric, tags);
    this.metrics.set(key, duration);
  }
  
  gauge(metric: string, value: number, tags: Record<string, string> = {}) {
    const key = this.buildKey(metric, tags);
    this.metrics.set(key, value);
  }
  
  async flush(): Promise<void> {
    // Send metrics to monitoring service (DataDog, New Relic, etc.)
    if (this.metrics.size === 0) return;
    
    const payload = Array.from(this.metrics.entries()).map(([key, value]) => ({
      metric: key,
      value,
      timestamp: Date.now()
    }));
    
    await this.sendToMonitoringService(payload);
    this.metrics.clear();
  }
  
  private buildKey(metric: string, tags: Record<string, string>): string {
    const tagString = Object.entries(tags)
      .map(([k, v]) => `${k}:${v}`)
      .join(',');
    
    return tagString ? `${metric}[${tagString}]` : metric;
  }
}

// Usage in API routes
export const metrics = new MetricsCollector();

export async function withMetrics<T>(
  operation: string,
  fn: () => Promise<T>,
  tags: Record<string, string> = {}
): Promise<T> {
  const start = Date.now();
  metrics.increment(`${operation}.attempts`, 1, tags);
  
  try {
    const result = await fn();
    metrics.increment(`${operation}.success`, 1, tags);
    metrics.timing(`${operation}.duration`, Date.now() - start, tags);
    return result;
  } catch (error) {
    metrics.increment(`${operation}.error`, 1, { ...tags, error: error.constructor.name });
    throw error;
  }
}

// Automatic metrics collection
setInterval(() => {
  metrics.flush();
}, 60000); // Flush every minute
```

### Error Tracking with Sentry

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  beforeSend(event, hint) {
    // Filter out noise
    if (event.exception) {
      const error = hint.originalException;
      if (error instanceof ValidationError) {
        return null; // Don't send validation errors
      }
    }
    
    return event;
  },
  
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Prisma({ client: prisma })
  ]
});

// Error boundary component
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{error.message}</p>
          <button onClick={resetError}>Try again</button>
        </div>
      )}
      beforeCapture={(scope, error, errorInfo) => {
        scope.setTag('component', 'ErrorBoundary');
        scope.setContext('errorInfo', errorInfo);
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
```

### Logging Strategy

```typescript
// Logger configuration
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'fitplatform-api',
    version: process.env.npm_package_version
  },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Structured logging
export function logUserAction(userId: string, action: string, metadata: any = {}) {
  logger.info('User action', {
    userId,
    action,
    metadata,
    timestamp: new Date().toISOString()
  });
}

export function logAPIRequest(request: NextRequest, response: NextResponse, duration: number) {
  logger.info('API request', {
    method: request.method,
    url: request.url,
    status: response.status,
    duration,
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for') || request.ip
  });
}

export function logIntegrationSync(userId: string, provider: string, result: SyncResult) {
  logger.info('Integration sync', {
    userId,
    provider,
    synced: result.synced,
    errors: result.errors.length,
    duration: result.duration
  });
}
```

---

## Development & Testing Strategy

### Testing Architecture

```typescript
// Test configuration
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};

module.exports = createJestConfig(customJestConfig);
```

#### Unit Testing Examples

```typescript
// __tests__/lib/auth.test.ts
import { generateTokens, verifyToken } from '@/lib/auth';

describe('Authentication', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    subscriptionTier: 'pro'
  };

  describe('generateTokens', () => {
    it('should generate valid access and refresh tokens', async () => {
      const tokens = await generateTokens(mockUser);
      
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      const tokens = await generateTokens(mockUser);
      const payload = await verifyToken(tokens.accessToken);
      
      expect(payload.sub).toBe(mockUser.id);
      expect(payload.email).toBe(mockUser.email);
    });

    it('should reject invalid token', async () => {
      await expect(verifyToken('invalid-token')).rejects.toThrow();
    });
  });
});

// __tests__/api/workouts.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/workouts';

describe('/api/workouts', () => {
  it('should create workout', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        authorization: 'Bearer valid-token'
      },
      body: {
        name: 'Test Workout',
        exercises: [{
          exerciseId: '1',
          sets: [{ reps: 10, weight: 100 }]
        }]
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.workout.name).toBe('Test Workout');
  });
});
```

#### Integration Testing

```typescript
// __tests__/integration/workout-flow.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { WorkoutCreator } from '@/components/WorkoutCreator';

const server = setupServer(
  rest.post('/api/workouts', (req, res, ctx) => {
    return res(ctx.json({ 
      workout: { 
        id: '1', 
        name: req.body.name,
        exercises: req.body.exercises 
      } 
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Workout Creation Flow', () => {
  it('should create workout successfully', async () => {
    render(<WorkoutCreator />);
    
    // Fill in workout details
    fireEvent.change(screen.getByLabelText('Workout Name'), {
      target: { value: 'Morning Routine' }
    });
    
    // Add exercise
    fireEvent.click(screen.getByText('Add Exercise'));
    fireEvent.change(screen.getByLabelText('Exercise'), {
      target: { value: 'Push-ups' }
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Create Workout'));
    
    // Verify success
    await waitFor(() => {
      expect(screen.getByText('Workout created successfully')).toBeInTheDocument();
    });
  });
});
```

#### E2E Testing with Playwright

```typescript
// e2e/workout-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Workout Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[data-testid=email]', 'test@example.com');
    await page.fill('[data-testid=password]', 'password123');
    await page.click('[data-testid=login-button]');
    await page.waitForURL('/dashboard');
  });

  test('should create and complete workout', async ({ page }) => {
    // Navigate to workout creation
    await page.click('[data-testid=create-workout]');
    
    // Fill workout details
    await page.fill('[data-testid=workout-name]', 'Test Workout');
    await page.selectOption('[data-testid=category]', 'strength');
    
    // Add exercises
    await page.click('[data-testid=add-exercise]');
    await page.fill('[data-testid=exercise-name]', 'Push-ups');
    await page.fill('[data-testid=sets]', '3');
    await page.fill('[data-testid=reps]', '10');
    
    // Save workout
    await page.click('[data-testid=save-workout]');
    await expect(page.locator('[data-testid=success-message]')).toBeVisible();
    
    // Start workout
    await page.click('[data-testid=start-workout]');
    await expect(page.locator('[data-testid=workout-timer]')).toBeVisible();
    
    // Complete workout
    await page.click('[data-testid=complete-workout]');
    await expect(page.locator('[data-testid=workout-complete]')).toBeVisible();
  });
});
```

### Development Environment Setup

```bash
# Development setup script
#!/bin/bash

# Clone repository
git clone https://github.com/your-org/fitplatform.git
cd fitplatform

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
echo "Please update .env.local with your actual values"

# Setup database
npm run db:setup
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "db:setup": "supabase start",
    "db:migrate": "supabase db reset",
    "db:seed": "tsx scripts/seed.ts",
    "generate:types": "supabase gen types typescript --local > types/supabase.ts"
  }
}
```

---

## Conclusion

This system architecture document provides a comprehensive blueprint for building FitPlatform as a scalable, secure, and maintainable fitness platform. The architecture leverages modern technologies and best practices to support:

- **10,000+ concurrent users** with horizontal scaling capabilities
- **Real-time data synchronization** across devices and platforms
- **Multi-tier subscription model** with role-based access control
- **Third-party integrations** with major fitness platforms
- **GDPR/CCPA compliance** with privacy-first design
- **High availability** with 99.9% uptime targets

The modular design allows for incremental development and deployment, enabling the team to start with an MVP and scale features based on user feedback and business requirements.

Key architectural strengths:
- **Performance**: Edge-optimized with multi-layer caching
- **Security**: End-to-end encryption and comprehensive authentication
- **Scalability**: Microservices with async processing
- **Reliability**: Comprehensive monitoring and error handling
- **Maintainability**: Clean code architecture with extensive testing

This architecture provides a solid foundation for building FitPlatform into a market-leading fitness technology platform.

---

**Document Status:** ✅ Complete  
**Review Date:** September 2025  
**Architecture Version:** 1.0
Based on your FitPlatform PRD, here are the specific short prompts you can use to invoke Claude Code agents at different development stages:

## **Phase 1: MVP Development (Months 1-3)**

### Initial Setup & Architecture
```
"Set up Next.js 14 project with Supabase backend for FitPlatform app"
→ rapid-prototyper

"Design database schema for users, workouts, and workout sessions with PostgreSQL"
→ backend-architect

"Create user authentication system with Supabase Auth and social login"
→ backend-architect
```

### Core UI Development
```
"Build workout creation form with exercises, sets, and reps using React Hook Form"
→ frontend-developer

"Design user dashboard showing recent workouts and quick stats"
→ ui-designer

"Create responsive workout logging interface for mobile and desktop"
→ frontend-developer
```

### Basic Integrations
```
"Implement Apple HealthKit integration for workout data sync"
→ ai-engineer

"Add manual workout logging with exercise database"
→ frontend-developer

"Build simple progress tracking with basic charts"
→ frontend-developer
```

### Testing & Quality
```
"Write unit tests for workout creation and user authentication"
→ test-writer-fixer

"Test workout logging API endpoints and data validation"
→ api-tester

"Optimize page load times for workout dashboard"
→ performance-benchmarker
```

## **Phase 2: Enhanced Features (Months 4-6)**

### Advanced Integrations
```
"Add Google Fit API integration with OAuth authentication"
→ backend-architect

"Implement Strava activity import and sync functionality"
→ ai-engineer

"Create real-time workout data sync with error handling"
→ backend-architect
```

### Analytics & Insights
```
"Build analytics dashboard with workout trends and progress charts"
→ frontend-developer

"Add AI-powered workout insights and recommendations"
→ ai-engineer

"Create progress comparison tools and goal tracking"
→ ui-designer
```

### Mobile Optimization
```
"Convert to PWA with offline workout logging capabilities"
→ mobile-app-builder

"Optimize mobile workout tracking interface with gestures"
→ frontend-developer

"Test mobile performance and battery usage during workouts"
→ performance-benchmarker
```

### Subscription System
```
"Implement Stripe subscription system with Pro tier features"
→ backend-architect

"Create subscription upgrade flow and billing management"
→ frontend-developer

"Test payment webhooks and subscription state management"
→ api-tester
```

## **Phase 3: Professional Tools (Months 7-9)**

### Trainer-Client Features
```
"Build trainer dashboard for managing multiple clients"
→ ui-designer

"Create client assignment system for custom workout plans"
→ backend-architect

"Add in-app messaging between trainers and clients"
→ frontend-developer
```

### Enterprise Features
```
"Implement role-based access control for Enterprise users"
→ backend-architect

"Create billing system for trainers to charge clients"
→ backend-architect

"Add session booking and calendar integration"
→ frontend-developer
```

### Advanced UI/UX
```
"Design trainer onboarding flow with certification verification"
→ ux-researcher

"Add client progress monitoring with detailed analytics"
→ ui-designer

"Create custom branding options for Enterprise accounts"
→ brand-guardian
```

### Testing & Compliance
```
"Ensure GDPR compliance for EU user health data"
→ legal-compliance-checker

"Test Enterprise features and multi-tenant data isolation"
→ test-writer-fixer

"Analyze user feedback from trainer beta program"
→ feedback-synthesizer
```

## **Phase 4: Scale & Optimize (Months 10-12)**

### Performance & Scale
```
"Optimize database queries for large workout datasets"
→ performance-benchmarker

"Implement caching strategy for workout recommendations"
→ backend-architect

"Scale Supabase setup for 10k+ concurrent users"
→ infrastructure-maintainer
```

### AI & Social Features
```
"Add machine learning workout recommendations based on user data"
→ ai-engineer

"Create social challenges and community features"
→ frontend-developer

"Implement workout sharing and social feed"
→ ui-designer
```

### Growth & Marketing
```
"Analyze user acquisition channels and optimize conversion"
→ growth-hacker

"Create content strategy for fitness community building"
→ content-creator

"Optimize app store listing for fitness app discovery"
→ app-store-optimizer
```

### Business Intelligence
```
"Build executive dashboard with key business metrics"
→ analytics-reporter

"Track subscription churn and implement retention strategies"
→ finance-tracker

"Analyze workout completion rates and user engagement patterns"
→ analytics-reporter
```

## **Ongoing Development Prompts**

### Bug Fixes & Maintenance
```
"Fix device sync issues with Apple Watch data"
→ test-writer-fixer

"Debug workout plan creation failures"
→ backend-architect

"Optimize slow loading workout history page"
→ performance-benchmarker
```

### Feature Iterations
```
"A/B test new workout recommendation algorithm"
→ experiment-tracker

"Improve user onboarding based on analytics data"
→ ux-researcher

"Add workout plan templates for specific fitness goals"
→ rapid-prototyper
```

### User Support & Feedback
```
"Analyze user complaints about device connectivity"
→ feedback-synthesizer

"Create help documentation for trainer features"
→ content-creator

"Handle user support tickets about billing issues"
→ support-responder
```

### Project Coordination
```
"Prioritize features for next 6-day sprint"
→ sprint-prioritizer

"Coordinate frontend and backend work for workout sharing feature"
→ studio-producer

"Plan Phase 4 rollout strategy and timeline"
→ project-shipper
```

## **Quick Reference Commands**

### Daily Development
- **New feature**: `"Build [feature] for [user type]"` → `rapid-prototyper`
- **Fix bugs**: `"Debug [issue] in [component]"` → `test-writer-fixer`
- **Design work**: `"Design [interface] for [use case]"` → `ui-designer`
- **API work**: `"Create [endpoint] for [functionality]"` → `backend-architect`

### Weekly Reviews
- **Performance**: `"Analyze performance issues in [area]"` → `performance-benchmarker`
- **User feedback**: `"Review user feedback from [period]"` → `feedback-synthesizer`
- **Sprint planning**: `"Prioritize features for next sprint"` → `sprint-prioritizer`
- **Metrics**: `"Generate weekly metrics report"` → `analytics-reporter`

### Monthly Planning
- **Feature planning**: `"Research [feature area] trends and opportunities"` → `trend-researcher`
- **Growth analysis**: `"Analyze user acquisition and retention"` → `growth-hacker`
- **Financial review**: `"Review subscription revenue and projections"` → `finance-tracker`
- **Roadmap planning**: `"Plan next phase development priorities"` → `studio-producer`

These prompts are designed to be specific enough to trigger the right agent while being flexible enough to adapt to your specific needs at each stage of development.
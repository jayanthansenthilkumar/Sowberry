# Sowberry Academy - Product Requirements Document

## Project Overview
Sowberry Academy is a comprehensive Learning Management System (LMS) for students, mentors, and administrators. It provides courses, assignments, aptitude tests, coding practice, learning games, and more.

## Architecture
- **Frontend:** Vite + React 19 + Tailwind CSS v4 (port 3000)
- **Backend:** Node.js + Express.js with MySQL/MariaDB (internal port 5555, proxied via FastAPI on port 8001)
- **Database:** MariaDB/MySQL (28 tables, schema: sowberry)
- **Auth:** JWT-based with RBAC (admin, mentor, student roles)

## Core Requirements (Static)
1. Multi-role authentication (admin, mentor, student)
2. Course management with subjects, topics, and content (video/text/pdf)
3. Assignment creation, submission, and grading
4. Aptitude test engine with multiple categories
5. Coding practice platform with problem solving
6. Learning games with challenges
7. Student progress tracking and certificates
8. Discussion forums and doubt resolution
9. Event management (webinars, workshops)
10. Study material management
11. Admin analytics and reporting dashboard
12. Contact form and newsletter

## User Personas
- **Admin (Sowmiya):** System administrator, manages users, courses, settings, analytics
- **Mentor (Jayanthan, Prithika, Sreelekha):** Creates courses, assignments, tests, grades students
- **Student (Aarav, Diya, Arjun, etc.):** Enrolls in courses, takes tests, submits assignments, practices coding

## What's Been Implemented (Phase 1 - March 2026)
### Audit & Bug Fixes
- [x] Fixed missing columns in aptitudeTests table (category, difficulty, icon)
- [x] Fixed hardcoded API URL in api.js (now uses VITE_API_URL env var)
- [x] Fixed CORS configuration (now allows all origins)
- [x] Fixed Vite allowedHosts for external access
- [x] Restructured project for Emergent platform (supervisor-compatible)

### Infrastructure Setup
- [x] MariaDB installed and configured with 28-table schema
- [x] Database seeded with users, courses, subjects, topics, content, aptitude tests, coding problems, game challenges
- [x] FastAPI reverse proxy bridging Express backend to platform requirements
- [x] Frontend restructured for Vite dev server on port 3000
- [x] All API endpoints functional (auth, admin, mentor, student, public)

### Testing Results
- Backend: 100% pass rate
- Frontend: 95% pass rate
- All role-based logins working
- All dashboard pages loading with data
- API integration fully functional

## Prioritized Backlog

### P0 (Critical)
- [ ] Email/OTP verification (currently mock - OTP returned in response)
- [ ] File upload for profile images (multer configured but needs testing)

### P1 (High Priority)
- [ ] React Native mobile app project setup
- [ ] Session timeout handling improvement
- [ ] Error boundary improvements
- [ ] Input validation on all forms (client + server)

### P2 (Medium Priority)
- [ ] Code execution engine for coding problems (currently client-side only)
- [ ] Export reports as PDF/Excel
- [ ] Dark mode persistence
- [ ] Certificate PDF generation
- [ ] Notification system enhancement

### Future/Phase 2
- [ ] AI-powered features (chatbot, content recommendations)
- [ ] CI/CD pipeline setup
- [ ] Performance optimization (lazy loading, caching)
- [ ] Comprehensive test suite (unit + integration)
- [ ] React Native mobile app (cross-platform)
- [ ] v0.3 branch with version control strategy

## Database Schema (28 Tables)
users, otpCodes, courses, courseEnrollments, courseSubjects, courseTopics, courseContent, courseMaterials, assignments, assignmentSubmissions, aptitudeTests, aptitudeQuestions, aptitudeTestAttempts, aptitudeAnswers, codingProblems, codingSubmissions, gameChallenges, gameUnlocks, events, eventRegistrations, discussions, discussionReplies, studyMaterials, grades, notifications, systemSettings, activityLogs, profileRequests, contactMessages, doubts, doubtReplies

## API Endpoints
- `/api/auth` - Authentication (login, register, OTP, password reset, profile)
- `/api/admin` - Admin panel (dashboard, users, courses, analytics, settings)
- `/api/mentor` - Mentor tools (courses, assignments, tests, events, discussions)
- `/api/student` - Student portal (courses, assignments, grades, coding, tests)
- `/api/public` - Public endpoints (courses, contact, newsletter)

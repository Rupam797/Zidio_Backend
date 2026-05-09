# 📡 ZIDIO CONNECT

<div align="center">
  <p><strong>A Full-Stack Professional Networking, Job & Internship Platform</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Spring_Boot_3.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" />
    <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
    <img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="WebSocket" />
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
    <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  </p>
</div>

---

## 📖 About

**Zidio Connect** is a production-ready, full-stack professional networking and job management platform built with **Spring Boot 3.5** and **React 19 + TypeScript**. It provides a role-based ecosystem for **Students**, **Recruiters**, and **Admins** — featuring real-time chat, social feeds with reactions, connection management, job applications, and more.

> **Live Demo:**  
> 🌐 Frontend: Deployed on **Vercel**  
> ⚙️ Backend: Deployed on **Render**  
> 🗄️ Database: **TiDB Serverless** (MySQL-compatible)

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based stateless authentication
- Role-based access control (`STUDENT`, `RECRUITER`, `ADMIN`)
- Email OTP verification for registration & password reset
- BCrypt password hashing
- Spring Security filter chain with HTTP 403 entry point

### 🧑‍🎓 Student Module
- Profile management (bio, skills, experience, social links)
- Profile picture & background image uploads (Cloudinary)
- Resume upload & management
- Job/Internship browsing with search, filter & pagination
- Job bookmarking (save/unsave)
- Application submission with cover letter
- Application status tracking (Applied → Shortlisted → Rejected → Withdrawn)
- Dashboard with stats (applications, shortlisted, saved jobs, connections)

### 🧑‍💼 Recruiter Module
- Company profile management
- Profile & background picture uploads
- Job/Internship posting & management
- View & manage received applications

### 👑 Admin Module
- Platform-wide dashboard with aggregated stats
- View all students and recruiters
- Block/unblock users
- Delete user accounts
- View and toggle job listing status (active/inactive)

### 💬 Real-Time Chat
- WebSocket (STOMP over SockJS) powered messaging
- Private 1-on-1 conversations
- Conversation list with last message preview
- Unread message tracking & mark-as-read
- Real-time message delivery via `/user/queue/messages`

### 📰 Social Feed
- Create text posts with image/video media (Cloudinary upload)
- Paginated news feed
- Rich reaction system: 👍 Like, 👏 Celebrate, ❤️ Love, 🤗 Support, 💡 Insightful, 😄 Funny
- Comment system with threaded discussions
- Post deletion by author

### 🤝 Connections
- Send/accept/decline connection requests
- View accepted connections with profile enrichment
- Connection suggestions
- Pending request management

### 🔔 Notifications
- Real-time notification system
- Types: `POST_LIKE`, `COMMENT`, `CONNECTION_REQUEST`, `CONNECTION_ACCEPTED`, `JOB_APPLICATION`
- Unread count badge
- Mark all as read

### 🔍 Global Search
- Debounced search across jobs, students, and recruiters
- Instant navigation to results

---

## 🛠️ Technology Stack

### Backend

| Component | Technology |
|---|---|
| Framework | Spring Boot 3.5.3 |
| Language | Java 17 |
| ORM | Spring Data JPA / Hibernate |
| Database | MySQL (TiDB Serverless in production) |
| Security | Spring Security + JWT (jjwt 0.11.5) |
| Real-Time | Spring WebSocket (STOMP + SockJS) |
| File Storage | Cloudinary (cloudinary-http44) |
| Email | Spring Boot Mail (Gmail SMTP) |
| Validation | Spring Boot Starter Validation |
| API Docs | SpringDoc OpenAPI 2.3.0 / Swagger UI |
| Build Tool | Maven |
| Code Gen | Lombok |

### Frontend

| Component | Technology |
|---|---|
| Framework | React 19.2.4 |
| Language | TypeScript 6.x |
| Build Tool | Vite 8.x |
| Styling | Tailwind CSS v4.2.2 |
| Routing | React Router 7.x |
| HTTP Client | Axios 1.x |
| Real-Time | @stomp/stompjs + sockjs-client |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Deployment | Vercel |

---

## 🗄️ Database Schema (Complete)

The application uses **10 MySQL tables** + **1 enum type**. Below is the complete schema derived from JPA entities.

### Enum: `Role`
```
STUDENT | RECRUITER | ADMIN
```

### Enum: `Application.Status`
```
APPLIED | SHORTLISTED | REJECTED | WITHDRAWN
```

### Enum: `Connection.Status`
```
PENDING | ACCEPTED | REJECTED
```

---

### Table: `users`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | Unique user ID |
| `username` | VARCHAR(255) | | Display name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Login email (used as principal) |
| `password` | VARCHAR(255) | | BCrypt-hashed password |
| `role` | ENUM('STUDENT','RECRUITER','ADMIN') | | User role |
| `enabled` | BOOLEAN | DEFAULT true | Account active flag |
| `otp_code` | VARCHAR(255) | | Temporary OTP for verification |
| `otp_expiry` | DATETIME | | OTP expiration timestamp |

---

### Table: `students`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | Student profile ID |
| `user_id` | BIGINT | FK → `users.id`, NOT NULL, UNIQUE | One-to-one link to user |
| `name` | VARCHAR(255) | | Full name |
| `phone` | VARCHAR(255) | | Phone number |
| `college` | VARCHAR(255) | | College/University |
| `branch` | VARCHAR(255) | | Branch/Department |
| `year_of_passing` | VARCHAR(255) | | Graduation year |
| `resume_url` | VARCHAR(255) | | Cloudinary resume URL |
| `profile_picture_url` | VARCHAR(255) | | Cloudinary profile image URL |
| `background_picture_url` | VARCHAR(255) | | Cloudinary banner image URL |
| `skills` | VARCHAR(1000) | | Comma-separated skills |
| `bio` | VARCHAR(500) | | Short biography |
| `linkedin_url` | VARCHAR(255) | | LinkedIn profile link |
| `github_url` | VARCHAR(255) | | GitHub profile link |
| `portfolio_url` | VARCHAR(255) | | Portfolio website link |
| `experience` | VARCHAR(2000) | | Work experience details |

---

### Table: `recruiters`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, FK → `users.id` (shared PK via @MapsId) | Maps 1:1 with user |
| `name` | VARCHAR(255) | | Recruiter's full name |
| `company_name` | VARCHAR(255) | | Company name |
| `company_website` | VARCHAR(255) | | Company website URL |
| `profile_picture_url` | VARCHAR(255) | | Cloudinary profile image URL |
| `background_picture_url` | VARCHAR(255) | | Cloudinary banner image URL |

---

### Table: `jobs`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | Job listing ID |
| `title` | VARCHAR(255) | | Job title |
| `description` | VARCHAR(3000) | | Detailed job description |
| `type` | VARCHAR(255) | | `JOB` or `INTERNSHIP` |
| `location` | VARCHAR(255) | | Job location |
| `salary` | VARCHAR(255) | | Salary/stipend range |
| `company_name` | VARCHAR(255) | | Company name |
| `skills` | VARCHAR(1000) | | Required skills |
| `application_deadline` | DATETIME | | Application deadline |
| `created_at` | DATETIME | NOT UPDATABLE, DEFAULT NOW | Creation timestamp |
| `is_active` | BOOLEAN | DEFAULT true | Listing active flag |
| `recruiter_id` | BIGINT | FK → `recruiters.id` | Posting recruiter |

---

### Table: `applications`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | Application ID |
| `student_id` | BIGINT | FK → `students.id`, NOT NULL | Applying student |
| `job_id` | BIGINT | FK → `jobs.id`, NOT NULL | Target job listing |
| `status` | ENUM | DEFAULT 'APPLIED' | APPLIED / SHORTLISTED / REJECTED / WITHDRAWN |
| `cover_letter` | VARCHAR(2000) | | Optional cover letter text |
| `applied_at` | TIMESTAMP | | Submission timestamp |
| `updated_at` | TIMESTAMP | Auto-updated via @PreUpdate | Last status change |

---

### Table: `posts`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | Post ID |
| `content` | VARCHAR(3000) | NOT NULL | Post text content |
| `image_url` | VARCHAR(255) | | Attached image (Cloudinary) |
| `video_url` | VARCHAR(255) | | Attached video (Cloudinary) |
| `author_email` | VARCHAR(255) | NOT NULL | Author's email |
| `author_name` | VARCHAR(255) | | Author's display name |
| `created_at` | DATETIME | NOT NULL, NOT UPDATABLE | Creation timestamp |
| `updated_at` | DATETIME | | Last edit timestamp |
| `like_count` | INT | DEFAULT 0 | 👍 Like reactions |
| `clap_count` | INT | DEFAULT 0 | 👏 Celebrate reactions |
| `love_count` | INT | DEFAULT 0 | ❤️ Love reactions |
| `support_count` | INT | DEFAULT 0 | 🤗 Support reactions |
| `insightful_count` | INT | DEFAULT 0 | 💡 Insightful reactions |
| `funny_count` | INT | DEFAULT 0 | 😄 Funny reactions |

---

### Table: `post_likes`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | Reaction record ID |
| `post_id` | BIGINT | NOT NULL, UNIQUE(post_id, user_email) | Target post |
| `user_email` | VARCHAR(255) | NOT NULL, UNIQUE(post_id, user_email) | Reacting user |
| `reaction_type` | VARCHAR(255) | NOT NULL, DEFAULT 'LIKE' | LIKE / CELEBRATE / LOVE / SUPPORT / INSIGHTFUL / FUNNY |
| `created_at` | DATETIME | NOT NULL, NOT UPDATABLE | Reaction timestamp |

---

### Table: `comments`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | Comment ID |
| `content` | VARCHAR(1000) | NOT NULL | Comment text |
| `author_email` | VARCHAR(255) | NOT NULL | Commenter's email |
| `author_name` | VARCHAR(255) | | Commenter's display name |
| `post_id` | BIGINT | NOT NULL | Parent post ID |
| `created_at` | DATETIME | NOT NULL | Comment timestamp |

---

### Table: `connections`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | Connection ID |
| `sender_email` | VARCHAR(255) | NOT NULL | Request sender |
| `receiver_email` | VARCHAR(255) | NOT NULL | Request receiver |
| `status` | ENUM('PENDING','ACCEPTED','REJECTED') | DEFAULT 'PENDING' | Connection state |
| `created_at` | DATETIME | DEFAULT NOW | Request timestamp |

---

### Table: `chat_messages`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | Message ID |
| `sender_email` | VARCHAR(255) | NOT NULL | Sender's email |
| `receiver_email` | VARCHAR(255) | NOT NULL | Receiver's email |
| `content` | TEXT | NOT NULL | Message body |
| `timestamp` | DATETIME | NOT NULL, DEFAULT NOW | Sent timestamp |
| `is_read` | BOOLEAN | DEFAULT false | Read receipt flag |

---

### Table: `notifications`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | Notification ID |
| `recipient_email` | VARCHAR(255) | NOT NULL | Target user email |
| `message` | VARCHAR(500) | NOT NULL | Notification text |
| `type` | VARCHAR(255) | | POST_LIKE / COMMENT / CONNECTION_REQUEST / CONNECTION_ACCEPTED / JOB_APPLICATION |
| `is_read` | BOOLEAN | DEFAULT false | Read status |
| `created_at` | DATETIME | DEFAULT NOW | Notification timestamp |

---

### Table: `saved_jobs`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | Bookmark ID |
| `student_email` | VARCHAR(255) | NOT NULL, UNIQUE(student_email, job_id) | Student's email |
| `job_id` | BIGINT | NOT NULL, UNIQUE(student_email, job_id) | Bookmarked job |
| `saved_at` | DATETIME | NOT NULL, NOT UPDATABLE | Bookmark timestamp |

---

## 🔗 Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o| STUDENTS : "has profile"
    USERS ||--o| RECRUITERS : "has profile"
    RECRUITERS ||--o{ JOBS : "posts"
    STUDENTS ||--o{ APPLICATIONS : "submits"
    JOBS ||--o{ APPLICATIONS : "receives"

    USERS {
        bigint id PK
        varchar email UK
        varchar username
        varchar password
        enum role
        boolean enabled
        varchar otp_code
        datetime otp_expiry
    }

    STUDENTS {
        bigint id PK
        bigint user_id FK
        varchar name
        varchar phone
        varchar college
        varchar branch
        varchar skills
        varchar bio
        varchar resume_url
        varchar profile_picture_url
        varchar background_picture_url
    }

    RECRUITERS {
        bigint id PK_FK
        varchar name
        varchar company_name
        varchar company_website
        varchar profile_picture_url
        varchar background_picture_url
    }

    JOBS {
        bigint id PK
        bigint recruiter_id FK
        varchar title
        varchar description
        varchar type
        varchar location
        varchar salary
        varchar skills
        datetime application_deadline
        datetime created_at
        boolean is_active
    }

    APPLICATIONS {
        bigint id PK
        bigint student_id FK
        bigint job_id FK
        enum status
        varchar cover_letter
        timestamp applied_at
        timestamp updated_at
    }

    POSTS {
        bigint id PK
        varchar content
        varchar image_url
        varchar video_url
        varchar author_email
        varchar author_name
        int like_count
        int clap_count
        int love_count
        int support_count
        int insightful_count
        int funny_count
    }

    POST_LIKES {
        bigint id PK
        bigint post_id
        varchar user_email
        varchar reaction_type
        datetime created_at
    }

    COMMENTS {
        bigint id PK
        bigint post_id
        varchar content
        varchar author_email
        varchar author_name
        datetime created_at
    }

    CONNECTIONS {
        bigint id PK
        varchar sender_email
        varchar receiver_email
        enum status
        datetime created_at
    }

    CHAT_MESSAGES {
        bigint id PK
        varchar sender_email
        varchar receiver_email
        text content
        datetime timestamp
        boolean is_read
    }

    NOTIFICATIONS {
        bigint id PK
        varchar recipient_email
        varchar message
        varchar type
        boolean is_read
        datetime created_at
    }

    SAVED_JOBS {
        bigint id PK
        varchar student_email
        bigint job_id
        datetime saved_at
    }

    POSTS ||--o{ POST_LIKES : "has reactions"
    POSTS ||--o{ COMMENTS : "has comments"
```

---

## 📂 Project Structure

```
zidio-connect/
├── zidio-connect/                    # ☕ Spring Boot Backend
│   ├── src/main/java/in/zidio/zidioconnect/
│   │   ├── config/
│   │   │   ├── CloudinaryConfig.java
│   │   │   ├── CorsConfig.java
│   │   │   ├── DataInitializer.java
│   │   │   ├── SwaggerConfig.java
│   │   │   ├── WebSocketAuthConfig.java
│   │   │   └── WebSocketConfig.java
│   │   ├── controller/
│   │   │   ├── AdminController.java
│   │   │   ├── AuthController.java
│   │   │   ├── ChatController.java
│   │   │   ├── CommentController.java
│   │   │   ├── ConnectionController.java
│   │   │   ├── NotificationController.java
│   │   │   ├── PostController.java
│   │   │   ├── RecruiterJobController.java
│   │   │   ├── RecruiterProfileController.java
│   │   │   ├── SearchController.java
│   │   │   ├── StudentApplicationController.java
│   │   │   ├── StudentController.java
│   │   │   └── StudentJobController.java
│   │   ├── dto/                      # 18 DTOs
│   │   ├── model/                    # 13 JPA Entities
│   │   ├── repository/               # 12 Spring Data Repositories
│   │   ├── security/
│   │   │   ├── CustomUserDetailsService.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── JwtTokenProvider.java
│   │   │   └── SecurityConfig.java
│   │   ├── service/                  # 14 Service classes
│   │   └── util/
│   │       └── CloudinaryFileUploader.java
│   └── pom.xml
│
└── zidio-connect-frontend/           # ⚛️ React + Vite Frontend
    ├── src/
    │   ├── api/                      # 10 API service modules
    │   │   ├── axios.ts              # Base Axios instance with JWT interceptor
    │   │   ├── auth.ts, admin.ts, chat.ts, connections.ts
    │   │   ├── jobs.ts, notifications.ts, posts.ts
    │   │   ├── profile.ts, search.ts
    │   ├── components/
    │   │   ├── Feed.tsx              # Social feed with reactions
    │   │   ├── Header.tsx            # Navigation + global search
    │   │   ├── Sidebar.tsx           # Left navigation panel
    │   │   └── Rightbar.tsx          # Right info panel
    │   ├── pages/
    │   │   ├── Login.tsx, Register.tsx
    │   │   ├── Home.tsx, Profile.tsx
    │   │   ├── Jobs.tsx, Applications.tsx
    │   │   ├── Chat.tsx, Connections.tsx
    │   │   ├── Notifications.tsx
    │   │   └── AdminDashboard.tsx
    │   ├── App.tsx                   # Root with React Router
    │   ├── main.tsx                  # Entry point
    │   └── index.css                 # Global styles
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+ &nbsp;|&nbsp; Node.js 18+ &nbsp;|&nbsp; MySQL &nbsp;|&nbsp; Maven

### Backend Setup
```bash
cd zidio-connect

# Configure src/main/resources/application.properties:
#   spring.datasource.url=jdbc:mysql://localhost:3306/zidio_connect
#   spring.datasource.username=root
#   spring.datasource.password=your_password
#   jwt.secret=your_secret_key
#   spring.mail.username=your_email@gmail.com
#   spring.mail.password=your_app_password
#   cloudinary.cloud_name / api_key / api_secret

./mvnw spring-boot:run
# → http://localhost:8080
```

### Frontend Setup
```bash
cd zidio-connect-frontend
npm install
# Create .env: VITE_API_BASE_URL=http://localhost:8080/api
npm run dev
# → http://localhost:5173
```

---

## 📚 API Reference

### 🔓 Auth (`/api/auth`) — Public
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register new user (Student/Recruiter) |
| POST | `/login` | Login → returns JWT + role |
| POST | `/request-otp` | Send OTP to email |
| POST | `/verify-otp` | Verify OTP code |
| POST | `/reset-password-otp` | Reset password after OTP verification |

### 🧑‍🎓 Student (`/api/student`) — ROLE_STUDENT
| Method | Endpoint | Description |
|---|---|---|
| GET | `/profile` | Get logged-in student profile |
| PUT | `/profile` | Update profile fields |
| POST | `/resume` | Upload resume (multipart) |
| POST | `/profile-picture` | Upload profile picture |
| POST | `/background-picture` | Upload background image |
| GET | `/dashboard` | Get dashboard statistics |
| GET | `/jobs` | Search/filter jobs (paginated) |
| GET | `/jobs/{id}` | Get job detail |
| POST | `/jobs/{id}/save` | Toggle save/unsave job |
| GET | `/jobs/saved` | Get all saved jobs |
| POST | `/apply/{jobId}` | Apply to a job |
| GET | `/applications` | Get my applications |
| PUT | `/applications/{id}/withdraw` | Withdraw application |

### 🧑‍💼 Recruiter (`/api/recruiter`) — ROLE_RECRUITER
| Method | Endpoint | Description |
|---|---|---|
| GET | `/profile` | Get recruiter profile |
| PUT | `/profile` | Update recruiter profile |
| POST | `/profile-picture` | Upload profile picture |
| POST | `/background-picture` | Upload background image |
| POST | `/jobs` | Create new job posting |
| GET | `/jobs` | Get my posted jobs |

### 👑 Admin (`/api/admin`) — ROLE_ADMIN
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Platform-wide stats |
| GET | `/students` | List all students |
| GET | `/recruiters` | List all recruiters |
| GET | `/jobs` | List all jobs |
| PUT | `/user/{id}/block` | Toggle block/unblock user |
| DELETE | `/user/{id}` | Delete user account |
| PUT | `/job/{id}/toggle` | Toggle job active status |

### 📰 Posts (`/api/posts`) — Authenticated
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get paginated feed |
| GET | `/mine` | Get my posts |
| POST | `/` | Create new post |
| POST | `/upload` | Upload media file |
| PUT | `/{id}/like?type=LIKE` | React to post |
| DELETE | `/{id}` | Delete own post |

### 💬 Comments (`/api/posts/{postId}/comments`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get comments for post |
| POST | `/` | Add comment |
| DELETE | `/{commentId}` | Delete own comment |

### 🤝 Connections (`/api/connections`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get my connections |
| GET | `/pending` | Get pending requests |
| GET | `/suggestions` | Get connection suggestions |
| POST | `/request` | Send connection request |
| PUT | `/{id}/accept` | Accept request |
| DELETE | `/{id}/decline` | Decline request |

### 💬 Chat (`/api/chat`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/conversations` | Get conversation list |
| GET | `/history/{email}` | Get message history |
| PUT | `/read/{email}` | Mark messages as read |
| WS | `/app/chat.send` | Send message (WebSocket STOMP) |

### 🔔 Notifications (`/api/notifications`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get my notifications |
| GET | `/unread-count` | Get unread count |
| PUT | `/mark-read` | Mark all as read |

### 🔍 Search (`/api/search`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/?q=keyword` | Global search across platform |

---

## 🔌 WebSocket Configuration

| Config | Value |
|---|---|
| Endpoint | `/ws` (SockJS fallback enabled) |
| App Prefix | `/app` |
| User Prefix | `/user` |
| Brokers | `/queue`, `/topic` |
| Send Message | `/app/chat.send` |
| Receive Messages | `/user/{email}/queue/messages` |
| Receive Errors | `/user/{email}/queue/errors` |

---

## 🔒 Security Architecture

```
Client Request
    │
    ▼
┌─────────────────────┐
│   CORS Filter        │  ← Configured in CorsConfig.java
├─────────────────────┤
│  JWT Auth Filter     │  ← Extracts & validates JWT from Authorization header
├─────────────────────┤
│  Security Filter     │  ← Role-based route authorization
│  Chain               │     /api/auth/**        → permitAll
│                      │     /api/student/**     → ROLE_STUDENT
│                      │     /api/recruiter/**   → ROLE_RECRUITER
│                      │     /api/admin/**       → ROLE_ADMIN
│                      │     /ws/**              → permitAll (handshake)
│                      │     Everything else     → authenticated
├─────────────────────┤
│  Controller Layer    │  ← Business logic execution
└─────────────────────┘
```

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m "Add amazing feature"`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📬 Contact

**Developer:** Rupam Giri  
🌐 LinkedIn: [linkedin.com/in/rupamgiri](https://www.linkedin.com/in/-rupam-giri/)

---

## 📄 License

This project is licensed under the **MIT License**.

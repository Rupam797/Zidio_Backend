# 🗄️ Zidio Connect Database Structure

This document provides a comprehensive and detailed breakdown of the MySQL database structure for the **Zidio Connect** platform. It outlines all tables, columns, data types, constraints, and relationships.

---

## 1. Core User Management

### `users`
Stores all registered users across the platform, handling authentication and authorization.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the user. |
| `username` | VARCHAR(255) | | The display name of the user. |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Primary email for login. |
| `password` | VARCHAR(255) | | BCrypt hashed password. |
| `role` | VARCHAR(255) | | Enum: `STUDENT`, `RECRUITER`, `ADMIN`. |
| `enabled` | BOOLEAN | DEFAULT TRUE | Indicates if the account is active. |
| `otp_code` | VARCHAR(255) | | OTP for password reset. |
| `otp_expiry` | DATETIME | | Expiration time of the OTP. |

### `students`
Stores detailed profile information for users with the `STUDENT` role.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier. |
| `user_id` | BIGINT | FOREIGN KEY (`users.id`), NOT NULL, UNIQUE | 1:1 relationship with the `users` table. |
| `name` | VARCHAR(255) | | Full name of the student. |
| `phone` | VARCHAR(255) | | Contact number. |
| `college` | VARCHAR(255) | | College or University name. |
| `branch` | VARCHAR(255) | | Field of study/branch. |
| `year_of_passing` | VARCHAR(255) | | Graduation year. |
| `resume_url` | VARCHAR(255) | | URL to the uploaded resume (Cloudinary). |
| `profile_picture_url`| VARCHAR(255) | | URL to profile picture. |
| `background_picture_url`| VARCHAR(255)| | URL to background banner image. |
| `skills` | VARCHAR(1000) | | Comma-separated or JSON list of skills. |
| `bio` | VARCHAR(500) | | Short biography. |
| `linkedin_url` | VARCHAR(255) | | LinkedIn profile link. |
| `github_url` | VARCHAR(255) | | GitHub profile link. |
| `portfolio_url` | VARCHAR(255) | | Personal portfolio link. |
| `experience` | VARCHAR(2000) | | Detailed experience description. |

### `recruiters`
Stores detailed profile information for users with the `RECRUITER` role.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, FOREIGN KEY (`users.id`) | Shared primary key forming a 1:1 relationship with `users`. |
| `name` | VARCHAR(255) | | Full name of the recruiter. |
| `company_name` | VARCHAR(255) | | Name of the hiring company. |
| `company_website`| VARCHAR(255) | | Website URL of the company. |
| `profile_picture_url`| VARCHAR(255)| | URL to profile picture. |
| `background_picture_url`| VARCHAR(255)|| URL to background banner image. |

---

## 2. Jobs & Applications

### `jobs`
Stores job and internship postings created by recruiters.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique job ID. |
| `recruiter_id` | BIGINT | FOREIGN KEY (`recruiters.id`) | The recruiter who posted the job. |
| `title` | VARCHAR(255) | | Job title. |
| `description` | VARCHAR(3000) | | Detailed job description. |
| `type` | VARCHAR(255) | | Job type: e.g., `JOB` or `INTERNSHIP`. |
| `location` | VARCHAR(255) | | Job location (e.g., Remote, City). |
| `salary` | VARCHAR(255) | | Salary or compensation details. |
| `company_name` | VARCHAR(255) | | Name of the company offering the job. |
| `skills` | VARCHAR(1000) | | Required skills. |
| `application_deadline`| DATETIME| | Deadline to apply. |
| `created_at` | DATETIME | NOT NULL, UPDATABLE=FALSE | When the job was posted. |
| `is_active` | BOOLEAN | DEFAULT TRUE | Indicates if the posting is still open. |

### `applications`
Stores job applications submitted by students.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique application ID. |
| `student_id` | BIGINT | FOREIGN KEY (`students.id`), NOT NULL | The student who applied. |
| `job_id` | BIGINT | FOREIGN KEY (`jobs.id`), NOT NULL | The job applied to. |
| `status` | VARCHAR(255) | DEFAULT 'APPLIED' | Enum: `APPLIED`, `SHORTLISTED`, `REJECTED`, `WITHDRAWN`. |
| `cover_letter` | VARCHAR(2000) | | Text submitted by student during application. |
| `applied_at` | DATETIME | | Timestamp of application. |
| `updated_at` | DATETIME | | Timestamp of last status update. |

### `saved_jobs`
Allows students to bookmark jobs for later viewing.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique record ID. |
| `student_email`| VARCHAR(255) | NOT NULL | Email of the student saving the job. |
| `job_id` | BIGINT | NOT NULL | ID of the saved job. |
| `saved_at` | DATETIME | NOT NULL | Timestamp when it was saved. |

*Constraint:* `UNIQUE(student_email, job_id)` prevents saving the same job twice.

---

## 3. Social Platform Features

### `posts`
User-generated content for the feed (text, images, video).

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique post ID. |
| `content` | VARCHAR(3000) | NOT NULL | Text content of the post. |
| `image_url` | VARCHAR(255) | | Optional image attachment. |
| `video_url` | VARCHAR(255) | | Optional video attachment. |
| `author_email` | VARCHAR(255) | NOT NULL | Email of the creator. |
| `author_name` | VARCHAR(255) | | Display name of the creator. |
| `created_at` | DATETIME | NOT NULL | Creation timestamp. |
| `updated_at` | DATETIME | | Last edit timestamp. |
| `like_count` | INT | DEFAULT 0 | Count of "Like" reactions. |
| `clap_count` | INT | DEFAULT 0 | Count of "Celebrate" reactions. |
| `love_count` | INT | DEFAULT 0 | Count of "Love" reactions. |
| `support_count`| INT | DEFAULT 0 | Count of "Support" reactions. |
| `insightful_count`|INT| DEFAULT 0 | Count of "Insightful" reactions. |
| `funny_count` | INT | DEFAULT 0 | Count of "Funny" reactions. |

### `post_likes`
Tracks individual reactions to posts.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique reaction ID. |
| `post_id` | BIGINT | NOT NULL | The ID of the post being reacted to. |
| `user_email` | VARCHAR(255) | NOT NULL | Email of the reacting user. |
| `reaction_type`| VARCHAR(255) | DEFAULT 'LIKE', NOT NULL| Type of reaction (e.g., LIKE, LOVE, CLAP). |
| `created_at` | DATETIME | NOT NULL | Timestamp of reaction. |

*Constraint:* `UNIQUE(post_id, user_email)` ensures a user can only have one active reaction per post.

### `comments`
Comments left on posts.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique comment ID. |
| `post_id` | BIGINT | NOT NULL | The ID of the parent post. |
| `author_email` | VARCHAR(255) | NOT NULL | Email of the comment author. |
| `author_name` | VARCHAR(255) | | Name of the comment author. |
| `content` | VARCHAR(1000) | NOT NULL | Text of the comment. |
| `created_at` | DATETIME | NOT NULL | Timestamp of comment. |

---

## 4. Networking & Communication

### `connections`
Tracks connection requests and established networks between users.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique connection record ID. |
| `sender_email` | VARCHAR(255) | NOT NULL | Email of user sending the request. |
| `receiver_email`| VARCHAR(255) | NOT NULL | Email of user receiving the request. |
| `status` | VARCHAR(255) | DEFAULT 'PENDING' | Enum: `PENDING`, `ACCEPTED`, `REJECTED`. |
| `created_at` | DATETIME | | Timestamp of the connection request. |

### `chat_messages`
Stores direct messages sent between users in real-time.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique message ID. |
| `sender_email` | VARCHAR(255) | NOT NULL | Email of the sender. |
| `receiver_email`| VARCHAR(255) | NOT NULL | Email of the receiver. |
| `content` | TEXT | NOT NULL | The chat message content. |
| `timestamp` | DATETIME | NOT NULL | Time message was sent. |
| `is_read` | BOOLEAN | DEFAULT FALSE | Whether receiver has read it. |

### `notifications`
Global notification system for alerting users of interactions.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique notification ID. |
| `recipient_email`|VARCHAR(255) | NOT NULL | Email of user being notified. |
| `message` | VARCHAR(500) | NOT NULL | Text body of the notification. |
| `type` | VARCHAR(255) | | Type (e.g., `POST_LIKE`, `COMMENT`, `CONNECTION_REQUEST`). |
| `is_read` | BOOLEAN | DEFAULT FALSE | Has the user seen the notification? |
| `created_at` | DATETIME | | Timestamp of notification. |

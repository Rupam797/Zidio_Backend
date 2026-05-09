# 📡 ZIDIO CONNECT

<div align="center">
  <p><strong>A Full-Stack Job, Internship & Social Networking Platform</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot" alt="Spring Boot" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  </p>
</div>

---

## 📖 About the Project

**Zidio Connect** is a robust, secure, full-stack social networking and job/internship management platform. It is designed to bridge the gap between **Students**, **Recruiters**, and **Admins** by providing a role-based ecosystem.

This platform goes beyond standard job portals by integrating social engagement features, real-time chat, meeting rooms, dynamic search, and more, allowing professionals and students to connect and grow.

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Role-based Access Control**: Separate dashboards and permissions for Students, Recruiters, and Admins.
- **JWT Authentication**: Secure stateless authentication for all API endpoints.
- **OTP Verification**: Email-based OTP system for registration and forgot password flows.

### 🧑‍🎓 Student Experience
- **Dynamic Profiles**: Manage resumes, profile pictures, and customizable background header images.
- **Job/Internship Browsing**: Advanced filtering and search for finding the perfect opportunity.
- **Application Tracking**: Monitor real-time status updates on submitted applications.

### 🧑‍💼 Recruiter Experience
- **Job Management**: Create, edit, and manage job & internship postings.
- **Applicant Tracking**: Review applications, download resumes, and update candidate statuses.

### 💬 Social & Communication
- **Real-Time Chat**: WebSocket-powered real-time messaging between users.
- **Meeting Rooms**: Integrated RTC for secure, synchronized virtual meeting rooms.
- **Social Engagement**: Rich post-interaction system with hover-based reactions (Like, Celebrate, Love, Support, Insightful, Funny).
- **Global Search Bar**: Dynamic, debounced search to instantly find jobs, students, and recruiters.

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.x (Java 17+)
- **Database**: MySQL (Spring Data JPA / Hibernate)
- **Security**: Spring Security + JWT
- **Real-Time**: Spring WebSocket
- **File Storage**: Cloudinary (Multipart uploads for images and resumes)
- **Documentation**: SpringDoc OpenAPI / Swagger

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router
- **Real-Time**: SockJS + StompJS
- **HTTP Client**: Axios

---

## 📂 Project Structure

This is a monorepo containing both the backend and frontend projects.

```text
zidio-connect/
│
├── zidio-connect/               # ☕ Spring Boot Backend
│   ├── src/main/java/...
│   │   ├── config/              # Security, CORS, WebSocket config
│   │   ├── controller/          # RESTful API endpoints
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── model/               # JPA Entities
│   │   ├── repository/          # Database repositories
│   │   ├── security/            # JWT filters and auth logic
│   │   ├── service/             # Business logic
│   │   └── util/                # Helpers (Cloudinary, Email, etc.)
│   └── pom.xml                  # Maven dependencies
│
└── zidio-connect-frontend/      # ⚛️ React + Vite Frontend
    ├── src/
    │   ├── api/                 # Axios instances and API services
    │   ├── assets/              # Static assets and images
    │   ├── components/          # Reusable UI components
    │   ├── pages/               # Page views (Dashboard, Chat, Profile)
    │   ├── App.tsx              # Root component
    │   └── main.tsx             # Entry point
    ├── package.json             # NPM dependencies
    └── tailwind.config.js       # Tailwind configuration
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### ✅ Prerequisites
- [Java 17+](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/) & npm
- [MySQL](https://www.mysql.com/) server running locally
- [Maven](https://maven.apache.org/)

### 1️⃣ Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd zidio-connect
   ```

2. **Configure Environment Variables:**
   Update your `src/main/resources/application.properties` with your local database and third-party credentials:

   ```properties
   # Server
   server.port=8080

   # Database Configuration (MySQL)
   spring.datasource.url=jdbc:mysql://localhost:3306/zidio_connect
   spring.datasource.username=root
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update

   # JWT Configuration
   jwt.secret=your_super_secret_jwt_key_that_is_very_long
   jwt.expirationMs=86400000

   # Mail Configuration (Gmail SMTP)
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your_email@gmail.com
   spring.mail.password=your_app_password
   spring.mail.properties.mail.smtp.auth=true
   spring.mail.properties.mail.smtp.starttls.enable=true

   # Cloudinary Configuration
   cloudinary.cloud_name=your_cloud_name
   cloudinary.api_key=your_api_key
   cloudinary.api_secret=your_api_secret
   ```

3. **Run the Backend:**
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend API will start at `http://localhost:8080`.*

### 2️⃣ Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd zidio-connect-frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of the frontend folder:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_WS_URL=http://localhost:8080/ws
   ```

4. **Run the Frontend:**
   ```bash
   npm run dev
   ```
   *The frontend application will start at `http://localhost:5173` (or the port defined by Vite).*

---

## 📚 API Documentation

Once the backend is running, you can access the interactive API documentation:
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

---

## 🤝 Contributing

Contributions are welcome! To contribute:
1. **Fork** the repository.
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m "Add amazing feature"`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open a Pull Request**.

---

## 📬 Contact & Support

**Developer:** Rupam Giri  
🌐 LinkedIn: [linkedin.com/in/rupamgiri](https://www.linkedin.com/in/-rupam-giri/)

---

## 📄 License

This project is licensed under the MIT License.

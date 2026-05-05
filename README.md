# 📡 ZIDIO CONNECT

ZIDIO CONNECT is a **Job & Internship Management System** built with **Spring Boot** to support a role-based platform for Students, Recruiters, and Admins. This backend exposes a RESTful API powering features like authentication, job posting, application tracking, resume uploads, and more.

---

## 📌 Features

- ✅ Role-based Authentication (Student, Recruiter, Admin)
- 🔐 OTP-based Forgot Password system
- 🧑‍🎓 Student Dashboard
  - Profile & Resume Management
  - Job/Internship Browsing
  - Application & Status Tracking
- 🧑‍💼 Recruiter Dashboard
  - Job Posting and Job Management
  - View & Manage Applications
- ⚙️ Admin Dashboard (coming soon)
- 📩 Email integration for OTP verification
- 🧾 RESTful APIs with JSON response handling

---

## 🛠️ Tech Stack

| Layer       | Technology          |
|------------|---------------------|
| Backend     | Spring Boot, Spring Security |
| Database    | MySQL (JPA/Hibernate) |
| Authentication | JWT + OTP via Email |
| File Upload | Multipart (Resume/Profile Picture) |
| API Docs    | SpringDoc OpenAPI / Swagger |
| Build Tool  | Maven |
| Java Version | Java 17+ |

---

## ⚙️ Getting Started

### ✅ Prerequisites

- Java 17+
- Maven 3.8+
- MySQL
- IDE (IntelliJ / Eclipse / VS Code)

---

### 🚀 Run Locally

1. **Clone the repository**

```bash
git clone https://github.com/<your-username>/zidio-connect-backend.git
cd zidio-connect-backend
```

2. **Configure MySQL database**

Update your `application.properties`:

```properties
# =========================
# Server Configuration
# =========================
server.port=8080

# =========================
# Database Configuration (MySQL)
# =========================
spring.datasource.url=jdbc:mysql://localhost:3306/zidio_connect
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# =========================
# JWT Configuration
# =========================
jwt.secret=your_jwt_secret
jwt.expirationMs=86400000

# =========================
# Mail Configuration (Gmail SMTP)
# =========================
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_email_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# =========================
# Cloudinary Configuration
# =========================
cloudinary.cloud_name=your_cloudinary_cloud_name
cloudinary.api_key=your_cloudinary_api_key
cloudinary.api_secret=your_cloudinary_api_secret

```

3. **Run the app**

```bash
./mvnw spring-boot:run
```

App will start at: `http://localhost:8080`

---

## 📁 Project Structure

```
in.zidio.zidioconnect
├── config         // Configuration classes (e.g., security, CORS, etc.)
├── controller     // REST controllers (Student, Recruiter, Admin, Auth)
├── dto            // Data Transfer Objects
├── model          // Entity classes (User, Job, Application, etc.)
├── repository     // Spring Data JPA Repositories
├── security       // JWT, filters, auth handlers
├── service        // Service logic
├── util           // Helpers (e.g. cloudinaryfileuploder)
└── ZidioConnectApplication.java

```

---

## 🔐 API Authentication

- **Login:** `/api/auth/login`
- **Register:** `/api/auth/register`
- **Forgot Password (OTP):** `/api/auth/forgot-password`
- **Verify OTP & Reset Password:** `/api/auth/verify-otp`

---

## 🔎 API Documentation

Visit:  
📘 Swagger UI: `http://localhost:8080/swagger-ui.html`  
🛠 SpringDoc: `http://localhost:8080/v3/api-docs`

---

## 🧪 Testing

You can test all endpoints using:
- [Postman](https://www.postman.com/)
- Swagger UI (enabled in dev)

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "Added xyz feature"`
4. Push to branch: `git push origin feat/your-feature`
5. Open a pull request ✅

---

## 📬 Contact

**Developer:** Rupam Giri   
🌐 LinkedIn: [linkedin.com/in/rupamgiri](https://www.linkedin.com/in/-rupam-giri/)

---

## 📄 License

This project is licensed under the MIT License.

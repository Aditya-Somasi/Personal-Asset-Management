# 🧾 Personal Asset Manager

A full-stack, role-based web application that helps manage personal and organizational assets efficiently. Built with **React.js (MUI)** on the frontend and **Spring Boot + PostgreSQL** on the backend, secured with **JWT authentication**.

## 🔧 Tech Stack

- **Frontend**: React.js, Vite, Material UI (MUI), Axios, React Router
- **Backend**: Spring Boot, Spring Security, Spring Data JPA, JWT, PostgreSQL
- **Authentication**: Role-based access (`ROLE_USER`, `ROLE_ADMIN`) with JWT
- **Others**: RESTful APIs, Pagination, File/Image URL preview, Context API

---

## 🚀 Features

### 👤 Authentication & Authorization
- JWT-based login and registration
- Role-based access: Admin / User
- Protected routes via React Context and Spring Security

### 📦 Asset Management
- Add, edit, delete, and view assets
- Optional image preview (via image URL)
- Paginated asset listing with responsive UI

### 👨‍💼 Admin Panel
- Assign assets to users
- View all users and their roles
- Manage categories and statuses (Add/Edit/Delete)

### 📁 Metadata Management
- Manage asset categories and statuses
- Dynamic dropdowns in asset forms (fetched from backend)

---

## ⚙️ Setup Instructions

### Backend (Spring Boot)

```bash
# Clone the repo
git clone https://github.com/Aditya-Somasi/asset-manager.git
cd asset-manager/backend

# Configure PostgreSQL DB credentials in application.properties

# Build and run
./mvnw spring-boot:run
```

### Frontend (React.js)

# Open a new terminal
cd asset-manager/frontend

# Install dependencies
npm install

# Start the dev server
npm start

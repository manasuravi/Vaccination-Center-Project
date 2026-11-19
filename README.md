# 💉 Vaccination Center Management System

A web-based Vaccination Center Management System that helps users find vaccination centers, register, log in, and book vaccination slots. Administrators can manage vaccination centers and monitor users and vaccination bookings.

## 📌 Project Overview

The Vaccination Center Management System is developed using React.js, Node.js, Express.js, and MySQL.

The application consists of two main modules:

- **User Module:** User registration, login, vaccination center search, and vaccination booking management.
- **Admin Module:** Admin login, vaccination center management, and viewing users and vaccination records.

## ✨ Features

### 👤 User Module
- User Registration
- User Login
- User Dashboard
- Search Vaccination Centers using PIN Code
- View Available Vaccination Centers
- Book Vaccination Slots
- View Vaccination Bookings
- Cancel Vaccination Bookings

### 🛡️ Admin Module
- Admin Login
- Admin Dashboard
- Add Vaccination Centers
- Update Vaccination Center Details
- Delete Vaccination Centers
- View Registered Users
- View Vaccination Records

### 🔧 Backend Features
- RESTful API Architecture
- Express.js Routing
- Controller and Model Structure
- MySQL Database Integration
- CRUD Operations
- Environment Variable Configuration
- CORS Support

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend Development |
| Vite | Frontend Build Tool |
| JavaScript | Application Logic |
| CSS | User Interface Styling |
| Node.js | Backend Runtime |
| Express.js | REST API Development |
| MySQL | Database |
| mysql2 | Database Connectivity |
| Postman | API Testing |
| Git & GitHub | Version Control |

## 📂 Project Structure

```text
Vaccination-Center-Project/
│
├── vaccination-frontend-complete/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── UserLogin.jsx
│   │   │   └── UserRegister.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── README.md
│
├── vaccination-backend/
│   └── vaccination-backend/
│       ├── config/
│       ├── controllers/
│       ├── database/
│       │   └── schema.sql
│       ├── models/
│       ├── routes/
│       ├── postman/
│       ├── .env.example
│       ├── package.json
│       └── server.js
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following software before running the project:

- [Node.js](https://nodejs.org/)
- [MySQL](https://dev.mysql.com/downloads/installer/)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
- [Visual Studio Code](https://code.visualstudio.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/manasuravi/Vaccination-Center-Project.git
```

Navigate to the project folder:

```bash
cd Vaccination-Center-Project
```

### 2. Setup MySQL Database

1. Open MySQL Workbench.
2. Connect to your local MySQL server.
3. Open the following SQL file:

```text
vaccination-backend/vaccination-backend/database/schema.sql
```

4. Execute the SQL script to create the database and tables.

Database Name:

```text
vaccination_db
```

Tables:
- centers
- users
- vaccinations

**Important:** The SQL script contains `DROP TABLE` statements. Running it again can delete existing table data. Use it only when you intend to recreate the database.

### 3. Setup Backend

Navigate to the backend directory:

```bash
cd vaccination-backend/vaccination-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory using `.env.example` as a template.

Configure your MySQL details:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=vaccination_db
```

Start the backend server:

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

### 4. Setup Frontend

Open another terminal and navigate to:

```bash
cd vaccination-frontend-complete
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the Vite URL displayed in your terminal. Usually:

```text
http://localhost:5173
```

## 🔗 API Endpoints

The backend provides three main API groups:

| Module | Base URL |
|---|---|
| Admin | `/api/admin` |
| Users | `/api/users` |
| Vaccinations | `/api/vaccinations` |

Example API endpoints:

```http
POST /api/admin/login

POST /api/users/register

POST /api/users/login

GET /api/users/:id

POST /api/vaccinations/book

GET /api/vaccinations/centers?pinCode=500072

DELETE /api/vaccinations/:id
```

## 🗄️ Database Design

The application uses a MySQL relational database with three main tables:

**1. Users**
- Stores registered user information.
- Contains user details such as name, email, phone, and PIN Code.

**2. Centers**
- Stores vaccination center information.
- Contains center name, address, city, state, PIN Code, vaccine name, available slots, and status.

**3. Vaccinations**
- Stores vaccination booking information.
- Connects users and vaccination centers through foreign keys.

## 🧪 API Testing

Postman is used to test the backend REST APIs.

The project includes a Postman collection and API documentation inside the backend project.

## 🔐 Security Note

This is an educational project and is not production-ready.

- User passwords are stored as plain text in the current training implementation.
- Admin credentials are hardcoded in the backend.
- JWT authentication and password hashing are not implemented.

For production use, implement secure password hashing, proper authentication, authorization, and environment-specific security configurations.

Never upload your actual `.env` file or database passwords to GitHub.

## 🎯 Project Objective

The main objective of this project is to understand and implement full-stack web application development using React.js, Node.js, Express.js, and MySQL.

It demonstrates frontend-backend integration, REST API development, database connectivity, CRUD operations, and Git-based version control.

## 👨‍💻 Developer

**Ravi**

GitHub: [@manasuravi](https://github.com/manasuravi)

---

⭐ If you find this project useful, consider giving it a star on GitHub!


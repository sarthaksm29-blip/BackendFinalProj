# SalesHub — Full-Stack CRM Platform

SalesHub is a full-stack Customer Relationship Management (CRM) platform designed to help sales teams manage **leads, deals, contacts, sales pipelines, notifications, and reports** from a single application.

The project consists of a **React frontend** and a **Node.js/Express backend** connected to **MongoDB**, with JWT authentication, role-based authorization, Socket.io real-time updates, and Firebase integration.

---

## 🚀 Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected API routes
* Role-based authorization
* Sales, manager, and admin access control

### Lead Management

* Create leads
* View all leads
* View individual leads
* Update leads
* Delete leads
* Assign leads to users
* Track lead status and source

### Deal Management

* Create deals
* View deals
* Update deal stages
* Delete deals
* Assign deals to sales users
* Track deal value and progress

### Contact Management

* Create contacts
* View contacts
* Update contacts
* Delete contacts
* Store customer contact information

### Sales Pipeline

* Visualize deals across sales stages
* Track deal progress
* Real-time pipeline updates using Socket.io

### Dashboard

* Sales overview
* Lead statistics
* Deal statistics
* Pipeline information
* Key CRM metrics

### Reports

* Sales and pipeline reports
* Role-protected reporting endpoints
* Admin/manager reporting access

### Notifications

* Firebase integration
* Push notification support
* Notification token management

### Real-Time Updates

* Socket.io integration
* Real-time `pipelineUpdated` events
* Live updates when deal information changes

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* JavaScript
* CSS
* Socket.io Client

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Socket.io
* Firebase
* CORS

## Tools

* Git & GitHub
* Postman
* MongoDB
* VS Code

---

# 📁 Project Structure

```text
BackendFinalProj/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthPage.jsx
│   │   │   ├── DashboardView.jsx
│   │   │   ├── LeadsView.jsx
│   │   │   ├── DealsView.jsx
│   │   │   ├── ContactsView.jsx
│   │   │   ├── PipelineView.jsx
│   │   │   ├── ReportsView.jsx
│   │   │   ├── NotificationsView.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── api.js
│   │   ├── socket.js
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── app.js
│
├── server.js
├── testSocket.js
├── API_DOCUMENTATION.md
├── README.md
├── package.json
└── .gitignore
```

---

# ⚙️ Installation & Setup

## 1. Clone the repository

```bash
git clone https://github.com/sarthaksm29-blip/BackendFinalProj.git
cd BackendFinalProj
```

## 2. Install backend dependencies

```bash
npm install
```

## 3. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

Firebase configuration should be provided through environment variables or secure local configuration.

**Never commit `.env` or Firebase service-account credentials to GitHub.**

---

# ▶️ Running the Project

## Start the Backend

From the project root:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5001
```

## Start the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Vite will provide the local frontend URL, normally:

```text
http://localhost:5173
```

---

# 🔑 Authentication

SalesHub uses JWT authentication for protected backend routes.

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

A successful login returns a JWT token.

Protected requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

The frontend stores and uses the token when communicating with protected backend APIs.

---

# 🔌 API Endpoints

The backend provides REST APIs for:

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Leads

```text
GET    /api/leads
GET    /api/leads/:id
POST   /api/leads
PUT    /api/leads/:id
DELETE /api/leads/:id
```

### Deals

```text
GET    /api/deals
GET    /api/deals/:id
POST   /api/deals
PUT    /api/deals/:id
DELETE /api/deals/:id
```

### Contacts

```text
GET    /api/contacts
GET    /api/contacts/:id
POST   /api/contacts
PUT    /api/contacts/:id
DELETE /api/contacts/:id
```

### Reports

```text
GET /api/reports
```

Reports are protected using authentication and role-based authorization.

### Notifications

Firebase-related endpoints provide notification token management and notification functionality.

---

# ⚡ Real-Time Communication

SalesHub uses **Socket.io** for real-time communication.

The main pipeline event is:

```text
pipelineUpdated
```

When a deal is updated, the backend can emit a `pipelineUpdated` event so connected clients can update their pipeline information in real time.

A Socket.io test client is available in:

```text
testSocket.js
```

Run it using:

```bash
node testSocket.js
```

---

# 🔥 Firebase

Firebase is integrated for authentication/notification functionality.

The project supports:

* Firebase authentication
* Firebase ID token verification
* Push notification token management
* Notification functionality

Firebase credentials are kept outside version control for security.

---

# 🖥️ Frontend

The React frontend provides a dashboard-based CRM interface.

Main views include:

* Authentication
* Dashboard
* Leads
* Deals
* Contacts
* Sales Pipeline
* Reports
* Notifications

The frontend communicates with the Express backend through REST APIs and uses Socket.io for real-time updates.

---

# 🧪 API Testing

The backend APIs were tested using **Postman**.

Testing includes:

* Authentication
* JWT protected routes
* Lead creation and retrieval
* Deal creation
* Contact creation
* Protected API access
* API responses and validation

## API Documentation

Full API documentation is available through the published Postman collection:

**SalesHub API Documentation:**
https://documenter.getpostman.com/view/58705388/2sBYHNXNsp

---

# 🔒 Security

The project implements:

* JWT authentication
* Protected routes
* Role-based authorization
* Environment variables for secrets
* Firebase credential protection
* `.gitignore` protection for sensitive files
* Request authentication middleware

Sensitive files such as:

```text
.env
firebase-service-account.json
```

are excluded from version control.

---

# 📌 Project Workflow

```text
React Frontend
      │
      ▼
REST API / Socket.io
      │
      ▼
Node.js + Express
      │
      ├── JWT Authentication
      ├── Authorization
      ├── Controllers
      ├── Middleware
      └── Routes
      │
      ▼
MongoDB + Mongoose
```

Firebase is used alongside the backend for authentication/notification functionality.

---

# 📊 Core Modules

| Module         | Purpose                           |
| -------------- | --------------------------------- |
| Authentication | User registration and JWT login   |
| Leads          | Manage potential customers        |
| Deals          | Manage sales opportunities        |
| Contacts       | Manage customer information       |
| Pipeline       | Track deal stages                 |
| Dashboard      | Display CRM statistics            |
| Reports        | Provide sales analytics           |
| Notifications  | Handle notification functionality |
| Socket.io      | Provide real-time updates         |

---

# 👨‍💻 Author

**Sarthak Mhatre**

SalesHub — Full-Stack CRM Project

GitHub:
https://github.com/sarthaksm29-blip/BackendFinalProj

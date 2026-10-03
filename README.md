# SalesHub Backend

SalesHub is a backend CRM system built with **Node.js, Express.js, MongoDB, Mongoose, JWT authentication, and Socket.io**.

It provides REST APIs for managing leads, deals, contacts, sales pipelines, authentication, and reports.

## Features

* JWT-based authentication
* Role-based authorization
* Lead management
* Deal management
* Contact management
* Sales pipeline management
* Admin/Manager reports
* Request validation
* RESTful APIs
* Real-time pipeline updates using Socket.io

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Socket.io
* CORS

## Project Structure

```text
SalesHub Backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   └── utils/
│
├── server.js
├── testSocket.js
├── package.json
├── API_DOCUMENTATION.md
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/sarthaksm29-blip/BackendFinalProj.git
cd BackendFinalProj
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env`

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

Do not commit the `.env` file to GitHub.

### 4. Start the server

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5001
```

## Authentication

### Register

```text
POST /api/auth/register
```

### Login

```text
POST /api/auth/login
```

Login returns a JWT token which is used to access protected routes.

Use the token as:

```text
Authorization: Bearer <JWT_TOKEN>
```

## API Modules

### Authentication

* Register
* Login

### Leads

* Get all leads
* Get a single lead
* Create a lead
* Update a lead
* Delete a lead

### Deals

* Get all deals
* Get a single deal
* Create a deal
* Update a deal
* Delete a deal

### Contacts

* Get all contacts
* Get a single contact
* Create a contact
* Update a contact
* Delete a contact

### Sales Pipeline

The pipeline APIs manage sales stages and provide real-time updates when deals are changed.

### Reports

Admin/manager reporting endpoints provide sales-related information and analytics.

## Real-Time Communication

SalesHub uses **Socket.io** for real-time pipeline updates.

The main event used is:

```text
pipelineUpdated
```

A test Socket.io client is included in:

```text
testSocket.js
```

Run it with:

```bash
node testSocket.js
```

## API Documentation

Complete API documentation is available through the published Postman collection.

The Postman documentation covers the available authentication, lead, deal, contact, pipeline, and reporting endpoints.

## Security

* JWT authentication protects private routes.
* Role-based middleware controls access to restricted operations.
* Environment variables are used for sensitive configuration.
* `.env` files are excluded from version control.

## Author

**Sarthak Mhatre**

SalesHub Backend Project

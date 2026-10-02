# SalesHub Backend

SalesHub is a backend CRM system built using Node.js, Express.js, MongoDB and Socket.io.

## Features

- JWT Authentication
- Role-based authorization
- Lead management
- Deal management
- Contact management
- Sales pipeline
- Admin/Manager reports
- Real-time pipeline updates using Socket.io
- Request validation
- REST APIs

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.io
- CORS

## Installation

Clone the repository and enter the project directory.

Install dependencies:

npm install

Create a `.env` file:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001

Start the server:

node server.js

The API will run on:

http://localhost:5001

## Authentication

Register or login using:

POST /api/auth/register

POST /api/auth/login

Use the returned JWT token in protected requests:

Authorization: Bearer <JWT_TOKEN>

## Main APIs

/api/auth
/api/leads
/api/deals
/api/contacts
/api/pipeline
/api/reports

## Real-Time Updates

Socket.io provides real-time pipeline updates through:

pipelineUpdated

## Project Structure

src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── socket/
└── utils/

server.js
package.json
README.md
API_DOCUMENTATION.md
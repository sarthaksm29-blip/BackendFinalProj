# SalesHub Backend API Documentation

Base URL:

http://localhost:5001

## Authentication

All protected APIs require:

Authorization: Bearer <JWT_TOKEN>

---

## Auth APIs

### Register

POST /api/auth/register

Body:

{
  "name": "Sarthak",
  "email": "sarthak@example.com",
  "password": "password123",
  "role": "sales"
}

### Login

POST /api/auth/login

Body:

{
  "email": "sarthak@example.com",
  "password": "password123"
}

---

## Leads

### Create Lead

POST /api/leads

Required:
- name
- email
- phone
- company

### Get Leads

GET /api/leads

### Get Single Lead

GET /api/leads/:id

### Update Lead

PUT /api/leads/:id

### Delete Lead

DELETE /api/leads/:id

---

## Deals

### Create Deal

POST /api/deals

### Get Deals

GET /api/deals

### Get Single Deal

GET /api/deals/:id

### Update Deal

PUT /api/deals/:id

### Delete Deal

DELETE /api/deals/:id

---

## Contacts

### Create Contact

POST /api/contacts

Required:
- name
- email
- phone
- company

### Get Contacts

GET /api/contacts

### Get Single Contact

GET /api/contacts/:id

### Update Contact

PUT /api/contacts/:id

### Delete Contact

DELETE /api/contacts/:id

---

## Pipeline

### Get Pipeline

GET /api/pipeline

Returns deals grouped by their stage.

---

## Reports

### Get Admin/Manager Reports

GET /api/reports

Requires:
- JWT authentication
- admin or manager role

---

## Socket.io

Socket.io server:

http://localhost:5001

Event:

pipelineUpdated

This event is emitted when the deal pipeline is updated.
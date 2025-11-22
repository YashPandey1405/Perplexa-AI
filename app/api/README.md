# 📘 Perplexa AI — Backend API Routes (Postman Collection Guide)

This document provides a clean, readable overview of all available backend routes for **Perplexa AI**, based on the Postman collection you provided. Developers and contributors can use this README to understand how each API endpoint works, what payloads are required, and how responses should look.

---

All routes below are prefixed with `/api/database/...`

---

# 📂 API Endpoints Overview

## 1. **Register Chat**

**Endpoint:** `POST /api/database/registerChat`

### 📌 Description

Stores a single chat message for a user along with the assistant's response.

### 📥 Request Body (JSON)

```json
{
  "clerkId": "user_35ow3uBxoem99OQC9P9tYx1b6QR",
  "conversationId": "conv_6920a9ee846c8194ab854c4509d8f699012ff5f41274d6av",
  "message": "How do you perform system design explanations?",
  "assistantResponse": "The System Design Agent references its architecture toolset—caching diagrams, load balancing templates, DB schema models—to generate a clean end-to-end blueprint."
}
```

### 📤 Success Response

```json
{
  "success": true,
  "message": "Chat registered successfully"
}
```

---

## 2. **Fetch User Chats**

**Endpoint:** `POST /api/database/getUserChats`

### 📌 Description

Retrieves all chats linked to the provided Clerk user ID.

### 📥 Request Body (JSON)

```json
{
  "clerkId": "user_35mFivbCClhsK8pLp3WTRhMHYn5"
}
```

### 📤 Success Response (Example)

```json
{
  "success": true,
  "chats": [
    {
      "conversationId": "conv_...",
      "message": "...",
      "assistantResponse": "..."
    }
  ]
}
```

---

## 3. **Register User**

**Endpoint:** `POST /api/database/registerUser`

### 📌 Description

Creates a new user entry in the database using Clerk details.

### 📥 Request Body (JSON)

```json
{
  "clerkId": "user_35ow3uBxoem99OQC9P9tYx1b9AZ",
  "email": "abcd@gmail.com",
  "fullName": "Yash Pandey",
  "imageUrl": "your_Image_Url"
}
```

### 📤 Success Response

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

# ✅ Summary

| Endpoint                     | Method | Description                          |
| ---------------------------- | ------ | ------------------------------------ |
| `/api/database/registerChat` | POST   | Register a chat + assistant response |
| `/api/database/getUserChats` | POST   | Fetch all chats for a user           |
| `/api/database/registerUser` | POST   | Register a new user in the DB        |

---

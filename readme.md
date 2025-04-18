# ✅ Todo API – Secure Task Management Backend

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![Express](https://img.shields.io/badge/express-%3E%3D4.17.1-yellow.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%3E%3D12.0-blue.svg)
![Winston](https://img.shields.io/badge/winston-%3E%3D3.0.0-red.svg)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)

A robust and secure RESTful API for managing todo items. Built with **Node.js**, **Express.js**, **PostgreSQL**, and secured with **JWT authentication**. This project also features rate limiting, centralized logging, form validation, and full integration test coverage using **Supertest**.

## 📚 Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
   - [Development](#development)
   - [Production](#production)
7. [API Documentation](#api-documentation)
   - [Authentication](#authentication)
     - [Register](#register)
     - [Login](#login)
     - [Change Password](#change-password)
   - [Todos](#todos)
     - [Create Todo](#create-todo)
     - [Get All Todos](#get-all-todos)
     - [Get Todo by ID](#get-todo-by-id)
     - [Update Todo](#update-todo)
     - [Delete Todo](#delete-todo)
8. [Testing](#testing)
9. [Contact](#contact)

---

## Introduction

This is a secure and scalable API project built from the ground up to manage todo tasks with user authentication and authorization. It's designed using best practices in Express.js architecture, with a clean modular structure and real-world functionality in mind.

---

## Features

### Authentication

- User registration & login
- Password change endpoint
- JWT-secured routes

### Todo Management

- Create, update, retrieve, and delete todos
- Pagination support
- Soft-deletion strategy

### Security

- Helmet + Rate limiting
- Express-validator middleware
- Environment-based configuration

### Logging

- Request logging with **Morgan**
- Persistent logs via **Winston**

### Testing

- Automated integration tests using Supertest
- Custom test runners via `npm scripts`

---

## Technologies Used

- **Node.js**, **Express.js**
- **PostgreSQL** (via `pg`)
- **JWT** (jsonwebtoken)
- **Winston**, **Morgan**
- **Express-validator**
- **Dotenv**, **Cross-env**, **Nodemon**
- **Moment.js** for date handling
- **Supertest** & native Node test runner

---

## Getting Started

### Prerequisites

- **Node.js** (v14.x or higher)
- **npm** (v6.x or higher)
- **PostgreSQL** (v12.x or higher)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/abrahamparn/Express-project.git
   cd todo_api
   ```

2. **Install Depedencies:**
   ```bash
   npm install
   ```

### Environment Variables

<p>Create a <code>.env</code> file in the root directory with the following variables:</p>

```
#Server Configuration
PORT=3003
SECRET=YOUR_JWT_SECRET_KEY
<br>

#Database Configuration
TEST_POSTGRES_URI={CHANGE INTO YOUR OWN URI}
PRODUCTION_POSTGRES_URI={CHANGE INTO YOUR OWN URI}
```

---

## Database Setup

1. **Create Database**

   ```sql
   -- Connect to PostgreSQL using psql or any GUI tool.

   -- Create production database
   CREATE DATABASE todos_app;

   -- Create test database
   CREATE DATABASE todos_app_test;
   ```

2. **Create Tables**
   <br>**Users table**
   ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
   ```
   **Todos Table:**
   ```sql
    CREATE TABLE todos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date DATE,
        priority INTEGER DEFAULT 0,
        is_completed BOOLEAN DEFAULT FALSE,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
   ```

---

## Running the Application

### Development

Start the server in development mode with hot-reloading using `nodemon`:

```bash
npm run dev
```

> Runs with NODE_ENV=test using nodemon.

### Production

Start the server in production mode:

```bash
npm start
```

The server will run on the port specified in the .env file (default is `3003`).

## API Documentation

### Authentication

#### Register

- Endpoint: POST `/api/authentication/register`
- Description: Register a new user.
- Headers: Content-Type: application/json
- Body Parameters:
  - username (string, required): Must be at least 6 characters.
  - password (string, required): Must be at least 6 characters.
  - name (string, required)
- **Responses:**
  - `201 Created`: User successfully registered.
    ```
    {
        "success": true,
        "message": "User successfully created",
        "username": "newuser"
    }
    ```
  - `400 Bad Request`: Validation errors or username already exists.
    ```
    {
        "error": "username already exists, please choose another one."
    }
    ```

#### Login

- Endpoint: POST `/api/authentication/register`
- Description: Register a new user.
- Headers: Content-Type: application/json
- Body Parameters:
  - username (string, required): Must be at least 6 characters.
  - password (string, required): Must be at least 6 characters.
  - name (string, required)
- Responses:
  - `201 Created`: User successfully registered.
    ```
    {
        "token": "jwt_token_here",
        "username": "existinguser"
    }
    ```
  - `400 Bad Request`: Invalid credentials or missing fields.
    ```
    {
        "error": "Invalid username or password"
    }
    ```

#### Change Password

- Endpoint: POST `/api/authentication/change-password`
- Description: Change the password of the authenticated user.
- Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>
- Body Parameters:
  - username (string, required)
  - password (string, required): Current password.
  - newPassword (string, required): New password, at least 6 characters.
- Responses:
  - `200 OK`: Password successfully updated.
    ```
    {
        "success": true,
        "message": "Password successfully updated"
    }
    ```
  - `400 Bad Request`: Validation errors or incorrect current password.
    ```
    {
        "error": "Current password is incorrect"
    }
    ```
  - `401 Unauthorized`: Missing or invalid token.
    ```
    {
        "error": "Unauthorized"
    }
    ```

### Todos

#### Create Todo

- Endpoint: POST `/api/todos`
- Description: Create a new todo item.
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer <JWT_TOKEN>
- Body Parameters:
  - title (string, required)
  - description (string, optional)
  - due_date (string, optional): Format DD/MM/YYYY.
  - priority (integer, optional): Non-negative integer, default is 0.
- Responses:

  - `201 Created`: Todo successfully created.

  ```
  {
      "success": true,
      "todo": {
          "id": 1,
          "title": "Sample Todo",
          "description": "This is a sample todo.",
          "is_completed": false,
          "is_deleted": false,
          "due_date": "2024-12-31",
          "priority": 1,
          "created_at": "2024-01-01T00:00:00.000Z",
          "updated_at": "2024-01-01T00:00:00.000Z"
      }
  }
  ```

  - `400 Bad Request`: Validation errors.

  ```
  {
    "errors": [
        {
            "type": "field",
            "value": "",
            "msg": "Title is required",
            "path": "title",
            "location": "body"
        }
    ]
  }
  ```

#### Get All Todos

- Endpoint: `GET /api/todos`
- Description: Retrieve all todos for the authenticated user with pagination.
- Headers:
  - Authorization: Bearer <JWT_TOKEN>
- Query Parameters:
  - page (integer, optional): Page number, default is 1.
  - limit (integer, optional): Number of todos per page, default is 10.
- Responses:
  - `200 OK`: Returns a list of todos.
    ```
    {
      "todos": [
          {
          "id": 1,
          "title": "Sample Todo",
          "description": "This is a sample todo.",
          "is_completed": false,
          "is_deleted": false,
          "due_date": "2024-12-31",
          "priority": 1,
          "created_at": "2024-01-01T00:00:00.000Z",
          "updated_at": "2024-01-01T00:00:00.000Z"
          }
          // More todos...
      ]
    }
    ```
  - `400 Bad Request`: Invalid query parameters.
    ```
    {
      "errors": [
         {
            "type": "field",
            "value": "hai",
            "msg": "Page must be a positive integer",
            "path": "page",
            "location": "query"
         },
      ]
    }
    ```

#### Get Todo by ID

- Endpoint: `GET /api/todos/:id`
- Description: Retrieve a specific todo by its ID.
- Headers:
  - Authorization: Bearer <JWT_TOKEN>
- Path Parameters:
  - id (integer, required): ID of the todo.
- Responses:
  - `200 OK`: Returns the requested todo.
    ```
    {
        "success": true,
            "todo": {
                "id": 1,
                "title": "Sample Todo",
                "description": "This is a sample todo.",
                "is_completed": false,
                "is_deleted": false,
                "due_date": "2024-12-31",
                "priority": 1,
                "created_at": "2024-01-01T00:00:00.000Z",
                "updated_at": "2024-01-01T00:00:00.000Z"
        }
    }
    ```
  - `400 Bad Request`: Invalid todo ID format.
    ```
    {
      "errors": [
          {
              "msg": "Todo ID must be a positive integer",
              "param": "id",
              "location": "params"
          }
      ]
    }
    ```
  - `404 Not Found`: Todo does not exist or has been deleted.
    ```
    {
        "error": "Todo not found"
    }
    ```

#### Update Todo

- Endpoint: `PUT /api/todos/:id`
- Description: Update an existing todo item.
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer <JWT_TOKEN>
- Path Parameters:
  - id (integer, required): ID of the todo.
- Body Parameters:
  - title (string, optional)
  - description (string, optional)
  - due_date (string, optional): Format DD/MM/YYYY.
  - priority (integer, optional): Non-negative integer, default is 0.
  - is_completed (boolean, optional)
- Responses:
  - `200 OK`: Todo successfully updated.
    ```
    {
      "success": true,
      "todo": {
          "id": 1,
          "title": "Updated Todo",
          "description": "Updated Description.",
          "is_completed": true,
          "is_deleted": false,
          "due_date": "2024-12-31",
          "priority": 2,
          "created_at": "2024-01-01T00:00:00.000Z",
          "updated_at": "2024-01-02T00:00:00.000Z"
      }
    }
    ```
  - `400 Bad Request`: Validation errors or invalid todo ID.
    ```
    {
        "errors": [
            {
                "type": "field",
                "value": "",
                "msg": "Title cannot be empty",
                "path": "title",
                "location": "body"
            }
        ]
    }
    ```
  - `404 Not Found`: Todo does not exist or has been deleted.
    ```
    {
        "error": "Todo not found or already deleted"
    }
    ```

#### Delete Todo

- Endpoint: `DELETE /api/todos/:id`
- Description: Soft-delete a todo item.
- Headers:
  - Authorization: Bearer <JWT_TOKEN>
- Path Parameters:
  - id (integer, required): ID of the todo.
- Responses:
  - `200 OK`: Todo successfully deleted.
    ```
    {
        "success": true,
        "message": "Todo deleted successfully"
    }
    ```
  - `404 Not Found`: Todo does not exist or has been deleted.
    ```
    {
        "error": "Todo not found or already deleted"
    }
    ```
  - `400 Bad Request`: Invalid todo ID format.
    ```
    {
        "error": "Invalid Todo ID"
    }
    ```

---

## Testing

Automated tests are implemented using Supertest and Node's built-in test module to ensure the reliability of the API endpoints.

### Running Tests

1. Ensure Test Database is Set Up:

- Make sure the todos_app_test database is created and the tables are migrated as per the Database Setup section.

2. Run Specific Tests:

- Todos Tests:

  ```
  npm run test:todos
  ```

- Authentication Tests:
  ```
  npm run test:authentication
  ```
- Test Module Tests:
  ```
  npm run test:test
  ```

### Test Coverage

The tests cover various scenarios, including:

- Successful operations (create, read, update, delete).
- Validation errors (missing fields, invalid formats).
- Unauthorized access attempts.
- Edge cases (e.g., deleting an already deleted todo).

**Note:** Ensure that your test environment uses the TEST_POSTGRES_URI to prevent data pollution in the production database.

## Contact

For any inquiries or support, please contact abrahamnaiborhu@gmail.com.

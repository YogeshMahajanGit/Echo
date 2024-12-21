# Chat App Backend

#Live Link (https://echo-client-v7ii.onrender.com/)

## Project Description

The Chat App backend is a robust and scalable server-side application designed to power real-time chat functionality. 
Built with Node.js and Express, it integrates MongoDB for data persistence and features user authentication, 
Socket.io for real-time communication, and comprehensive group chat management.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Installation and Setup](#installation-and-setup)
- [Routes](#routes)
- [Deployment](#deployment)

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express.js**: Web framework for creating the RESTful API.
- **MongoDB**: NoSQL database for storing user and chat data.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **Socket.io**: Real-time communication library.
- **JWT (JSON Web Tokens)**: For secure authentication.
- **Bcrypt.js**: For password hashing.
- **Cloudinary**: For media storage.

## Features

- User registration and login with secure JWT authentication.
- Cookie-based authentication for session management.
- Real-time chat functionality using Socket.io.
- Infinite scroll for chat 
- Group chat management:
  - Create groups
  - Rename groups
  - Add or remove members
  - Delete groups
  - Leave groups
- Notifications for friend requests and group activities.
- User search and profile management.
- Comprehensive validations for all routes.
- Loading state management for better user experience.

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
MONGO_URI=<your_mongodb_connection_string>
NODE_ENV=PRODUCTION
PORT=3000
CLIENT_URL=<frontend_url>
JWT_SECRET=<your_jwt_secret>
ADMIN_SECRET_KEY=<your_admin_secret_key>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
```

## Routes

### Chat Routes

- **POST** `/chat/newGroup`: Create a new group.
- **GET** `/chat/my`: Get messages from personal chats.
- **GET** `/chat/my/groups`: Get user’s groups.
- **PUT** `/chat/addmembers`: Add members to a group.
- **PUT** `/chat/removemembers`: Remove members from a group.
- **DELETE** `/chat/leavegroup/:id`: Leave a group.
- **POST** `/chat/message`: Send a message with attachments.
- **GET** `/chat/message/:id`: Retrieve messages for a chat.
- **GET/PUT/DELETE** `/chat/:id`: Manage a specific chat (get details, rename, or delete).

### User Routes

- **POST** `/user/new`: Register a new user.
- **POST** `/user/login`: User login.
- **GET** `/user/me`: Get user profile.
- **GET** `/user/logout`: User logout.
- **GET** `/user/search`: Search for users.
- **PUT** `/user/send-request`: Send a friend request.
- **PUT** `/user/accept-request`: Accept a friend request.
- **GET** `/user/notifications`: Get user notifications.
- **GET** `/user/friends`: Get user’s friends.

### Admin Routes

- **POST** `/admin/verify`: Admin login.
- **GET** `/admin/logout`: Admin logout.
- **GET** `/admin/`: Get admin data.
- **GET** `/admin/users`: Get all users.
- **GET** `/admin/chats`: Get all chats.
- **GET** `/admin/messages`: Get all messages.
- **GET** `/admin/stats`: Get dashboard statistics.

Thank you for exploring the Chat App backend.

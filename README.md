# Echo Chat-App

## Live Application

Check out the live app here: [Echo Chat-App](https://echo-client-v7ii.onrender.com/)

## Project Description

Echo Chat App is a real-time chat application built with the MERN stack. 
It supports seamless communication between users with features like live chat, group chats, user notifications, and advanced socket integration. 
The app is designed with responsive UI using Material-UI and Redux Toolkit for state management, making it a reliable and modern chat platform.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Environment Variables](#environment-variables)
- [Setup Instructions](#setup-instructions)
- [Frontend](#frontend)
- [Backend](#backend)
- [Future Enhancements](#future-enhancements)

## Features

### General Features
- Fully responsive design for mobile and desktop
- Live chat functionality
- User authentication and authorization using cookies
- Real-time notifications

### Chat Features
- Infinite chat scroll
- Send and receive friend requests
- Accept or reject friend requests
- Create, rename, or delete group chats
- Add or remove members from groups
- Send text messages and attachments
- View chat history and notifications

### Admin Features
- Dashboard for viewing users, chats, and messages
- View platform stats and activity logs

## Technologies Used

### Frontend
- **React**: JavaScript library for building user interfaces
- **Redux Toolkit**: State management
- **Material-UI (MUI)**: UI components
- **React Router**: Routing library
- **Axios**: HTTP client
- **Socket.IO-Client**: Real-time communication
- **Chart.js**: Data visualization
- **React-Hot-Toast**: Notifications

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Socket.IO**: WebSocket communication
- **JWT**: JSON Web Tokens for authentication
- **Multer**: File upload handling
- **Cloudinary**: Image storage
- **Bcrypt**: Password hashing

## Environment Variables

The following environment variables are required to run the project:

### Frontend
- `VITE_SERVER`: The URL of the backend server.

### Backend
- `MONGO_URI`: MongoDB connection string.
- `NODE_ENV`: Environment (e.g., `production`, `development`).
- `PORT`: Backend server port.
- `CLIENT_URL`: Frontend URL.
- `JWT_SECRET`: Secret key for JWT.
- `ADMIN_SECRET_KEY`: Secret key for admin authentication.
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Cloudinary API secret.


## Frontend

The frontend is built using React with Vite for fast development. It uses Material-UI for a modern and responsive design.

### Key Libraries
- Material-UI
- Redux Toolkit
- React-Router
- Axios
- Socket.IO-Client

## Backend

The backend is powered by Node.js with Express for handling API requests. MongoDB is used as the database, and Socket.IO enables real-time features.

### Key Libraries
- Express
- Mongoose
- Socket.IO
- Cloudinary
- Multer
- JWT Authentication

## Future Enhancements

- Implement read receipts for messages
- Add support for video and voice calls
- Enable message search functionality
- Improve admin dashboard with more analytics


Thanks for reading!


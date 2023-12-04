# video-chat

Welcome to the `video-chat` application, a platform designed for public chat across various rooms, private messaging, and initiating private video sessions. This application utilizes Vue-Socket.io/socket.io for real-time communication for messaging and the MediaStream API for video communication.

## Features

- **Public Chat:** Engage in public chat rooms, sending and receiving messages in real-time.
- **Private Chat:** Enjoy private conversations between two users, ensuring a more personalized experience.
- **Private Video Sessions:** Initiate private video sessions between two users for face-to-face communication.

## Technologies Used

- **Frontend:**

  - Vue
  - Vuex
  - TypeScript
  - Vuetify
  - Axios
  - Vue-Socket.io

- **Backend:**
  - Express
  - Socket.io
  - MySQL (with Sequelize)
  - Redis

## Authentication

The application features custom authentication using JSON Web Tokens (JWT) and also supports Google OAuth 2.0 for user authentication.

## Application Demo

![app_demo](https://github.com/raf0nx/video-chat/assets/69021954/5b0ec4e4-01f9-401f-a8c2-10a1f0d08a58)

## How to Run Locally

### Frontend

1. Clone the repository:

   ```bash
   git clone git@github.com:raf0nx/video-chat.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run serve
   ```

   **Note:** Ensure that your Node.js version is less than 17.

### Backend

**Note:** The backend repository is currently private for security reasons.

1. Ensure you have a MySQL instance running on `127.0.0.1`.
2. Start the Redis key-value store by running the following command:

   ```bash
   redis-server
   ```

   It should be running on `localhost` at port `6379`.

3. Install backend dependencies:

   ```bash
   npm install
   ```

4. Run the backend server:
   ```bash
   npm run start
   ```

Now you should have both the frontend and backend up and running locally. Enjoy using the `video-chat` application! 💬 👥

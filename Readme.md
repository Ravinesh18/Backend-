# Stream Hub

Stream Hub is a YouTube-type web application built with Express, Node.js, and MongoDB. Users can upload, view, and comment on videos. This README provides an overview of the project and instructions on how to set it up and run it locally.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- Video upload and streaming
- Commenting on videos
- Liking and disliking videos
- User profile management

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer (for file uploads)
- JWT (JSON Web Tokens) for authentication

## Installation

To get a local copy up and running, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/stream-hub.git
    cd stream-hub
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up MongoDB:**

    Make sure you have MongoDB installed and running on your local machine or use a cloud MongoDB service. Create a database for the app.

## Configuration

Create a `.env` file in the root directory and add the following environment variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key


## Running the App
Start the server:

npm start
The server will start on the port specified in the .env file.

Access the app:

Open your browser and go to http://localhost:3000.

API Endpoints
Here are some of the main API endpoints available in the application:

## Auth

POST /api/auth/register - Register a new user
POST /api/auth/login - Log in a user
Users

GET /api/users/:id - Get user profile
PUT /api/users/:id - Update user profile
Videos

POST /api/videos - Upload a new video
GET /api/videos - Get all videos
GET /api/videos/:id - Get a specific video
PUT /api/videos/:id - Update a video
DELETE /api/videos/:id - Delete a video
Comments

POST /api/videos/:videoId/comments - Add a comment to a video
GET /api/videos/:videoId/comments - Get all comments for a video

## Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature-name).
Make your changes.
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature/your-feature-name).
Open a pull request.
License
This project is licensed under the MIT License. See the LICENSE file for details.

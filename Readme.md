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

# UNCC News Portal (A04)

This project is a full-stack web application featuring a client-side built with Angular and a server-side built with Node.js and Express. It includes user authentication, web scraping for UNCC news articles, and data visualization using charts.

## Project Structure

The project is organized into two main directories:

- `client/`: Contains the Angular frontend application.
- `server/`: Contains the Node.js/Express backend application.

```
A04/
├── client/         # Angular Frontend
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   ├── README.md     # Client-specific README
│   └── ...
├── server/         # Node.js Backend
│   ├── server.js
│   ├── package.json
│   ├── .env          # Environment variables (needs creation)
│   └── .gitignore
└── README.md       # Main Project README (this file)
```

## Getting Started

### Prerequisites

- Node.js and npm (or yarn) installed.
- MongoDB instance running (locally or cloud-hosted).

### Server Setup

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create environment file:**
    Create a `.env` file in the `server` directory and add your MongoDB connection string and JWT secret. See [`server/.env`](/Users/aman/Documents/itis-5166-network-based-application-development/A04/server/.env) for an example structure:
    ```
    MONGO_URI=mongodb://your_mongodb_uri/your_db_name
    JWT_SECRET=your_super_secret_jwt_key
    ```
4.  **Start the server:**
    ```bash
    npm start
    ```
    The server will run on `http://localhost:3000` (or the port specified in `process.env.PORT`).

### Client Setup

1.  **Navigate to the client directory:**
    ```bash
    cd ../client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    ng serve
    ```
    The Angular application will be served at `http://localhost:4200/`.

## Features

- **User Authentication:** Secure signup and login using JWT.
- **News Scraping:** Fetches the latest news articles from the official UNCC news page (`https://inside.charlotte.edu/news-features/`) using Cheerio.
- **Data Visualization:** Displays data using Chart.js# UNCC News Portal (A04)

This project is a full-stack web application featuring a client-side built with Angular and a server-side built with Node.js and Express. It includes user authentication, web scraping for UNCC news articles, and data visualization using charts.

## Features

- **User Authentication:** Secure signup and login using JWT.
- **Data Visualization:** Displays data using Chart.js

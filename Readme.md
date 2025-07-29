# Modern Full-Stack Note-Taking App

A secure and modern note-taking application built with a focus on a clean user interface and passwordless authentication. This project features a React/TypeScript frontend and a Node.js/Express backend, with JWT-based authorization for all user-specific actions.


## ✨ Features

-   **Secure User Signup:** New users can sign up with their Name, Date of Birth, and Email.
-   **Passwordless Authentication:** Users sign up and sign in using a One-Time Password (OTP) sent to their email, eliminating the need to store passwords.
-   **JWT-Based Authorization:** After successful authentication, a JSON Web Token (JWT) is issued to the user to authorize access to protected API routes.
-   **Full CRUD for Notes:** Authenticated users can Create, Read, and Delete their own notes.
-   **Responsive UI:** The application features a modern, responsive, two-column layout that looks great on both desktop and mobile devices.
-   **Environment-Based API Configuration:** The frontend uses environment variables to easily switch between local and production API endpoints.
-   **Backend Validation:** The API includes validation for user input and provides clear error messages.

## 🛠️ Technology Stack

| Category      | Technology                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| **Frontend**  | React.js, TypeScript, React Router, Axios                                                                   |
| **Backend**   | Node.js, Express.js, TypeScript                                                                             |
| **Database**  | MongoDB with Mongoose ODM                                                                                   |
| **Auth**      | JSON Web Tokens (JWT), Nodemailer (for OTP emails), bcrypt.js (for OTP hashing)                               |
| **Styling**   | CSS (with a mobile-first approach)                                                                          |
| **Dev Tools** | Git, ts-node-dev, npm                                                                                       |

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have the following software installed on your machine:
-   [Node.js](https://nodejs.org/) (which includes npm) v16 or later.
-   [Git](https://git-scm.com/)
-   A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for the database.
-   A Gmail account with 2-Step Verification and an App Password for sending OTP emails.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/YourUsername/your-repo-name.git
    cd your-repo-name
    ```

2.  **Setup the Backend (`server`):**
    ```sh
    # Navigate to the server directory
    cd server

    # Install NPM packages
    npm install
    ```
    -   Create a `.env` file in the `server` directory. Copy the structure from the [Environment Variables](#-environment-variables) section below and fill in your credentials.

3.  **Setup the Frontend (`client`):**
    ```sh
    # Navigate back to the root and then to the client directory
    cd ../client

    # Install NPM packages
    npm install
    ```
    -   Create a `.env` file in the `client` directory. See the [Frontend Environment Variables](#-frontend-environment-variables) section for instructions.

### 🏃 Running the Application

You will need to run the backend and frontend servers in two separate terminals from the project root.

-   **Terminal 1: Start the Backend Server**
    ```sh
    cd server
    npm run dev
    ```
    The backend server will be running on `http://localhost:5001`.

-   **Terminal 2: Start the Frontend Application**
    ```sh
    cd client
    npm start
    ```
    The React application will open in your browser at `http://localhost:3000`.

## ⚙️ Environment Variables

### Backend Environment Variables

For the server to function correctly, you must create a `.env` file in the `server/` directory.

**File: `server/.env`**
```ini
# --- Server & Database ---
# The port your backend server will run on
PORT=5001

# Your MongoDB connection string from MongoDB Atlas
# Example: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGO_URI=

# A long, random, and secret string for signing JWTs
JWT_SECRET=

# --- Email Service Variables (For Gmail) ---
# To get your EMAIL_PASS, you must enable 2-Step Verification on your Google account
# and then generate a 16-digit "App Password".
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=
```

### Frontend Environment Variables

For the client to know where to send API requests, you must create a `.env` file in the `client/` directory.

**File: `client/.env`**
```ini
# The URL pointing to your backend API
# For local development, this is your server's address.
# For production, this will be your deployed backend's live URL.
REACT_APP_API_URL=http://localhost:5001/api
```

## 🚀 Deployment

This project is structured for easy deployment on platforms like Render (for the backend) and Vercel/Netlify (for the frontend).

1.  **Deploy the Backend:**
    -   Push your code to GitHub.
    -   Connect your repository to a hosting service like [Render](https://render.com/).
    -   Set up the environment variables (from `server/.env`) in the Render dashboard.
    -   Once deployed, you will get a live URL for your API (e.g., `https://your-app-name.onrender.com`).

2.  **Deploy the Frontend:**
    -   Connect the same repository to a frontend hosting service like [Vercel](https://vercel.com/).
    -   Set the `REACT_APP_API_URL` environment variable in the Vercel dashboard, using the live URL of your deployed backend (e.g., `https://your-app-name.onrender.com/api`).
    -   Deploy. Your full-stack application is now live!

## 🔐 API Endpoints

| Method | Route                   | Description                                    | Protected |
| :----- | :---------------------- | :--------------------------------------------- | :-------: |
| `POST` | `/api/auth/generate-otp`| Generates and emails an OTP to the user.       |    No     |
| `POST` | `/api/auth/verify-otp`  | Verifies OTP. Signs up or logs in the user.    |    No     |
| `GET`  | `/api/notes`            | Fetches all notes for the logged-in user.      |    Yes    |
| `POST` | `/api/notes`            | Creates a new note for the logged-in user.     |    Yes    |
| `DELETE`| `/api/notes/:id`        | Deletes a specific note owned by the user.     |    Yes    |

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

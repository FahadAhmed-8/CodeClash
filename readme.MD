# 🚀 CodeClash - The Ultimate Online Judge Arena

CodeClash is a full-stack, three-tier competitive programming platform designed for mastery. It features a secure, Docker-isolated code execution engine, a global leaderboard, and an AI-powered mentor that provides proactive debugging hints without spoiling solutions.

## 🏗️ Architecture Overview

CodeClash is built with a decoupled three-tier architecture to ensure scalability and security:

- **Frontend (React/Vite)**: Modern UI with Monaco-based code editor, real-time leaderboard, and personalized developer profiles
- **Backend (Node.js/Express)**: Central API handling user authentication, problem management, submission history, and leaderboard aggregation
- **Compiler (Docker/Node.js)**: Dedicated execution service managing isolated Docker containers to safely run and evaluate user-submitted code against test cases

## 🌟 Key Features

### 🔐 Isolated Code Execution
High-speed Docker containers ensure user code is evaluated in a secure, language-specific sandbox environment.

### 🧞 AI Genie Mentor
Proactive logic analysis and debugging hints powered by Groq API to guide users through challenging problems.

### 🏆 Global Leaderboard
Comprehensive ranking system featuring detailed performance statistics and problem-solving metrics.

### 👤 Developer Profiles
Customizable user profiles featuring bios, social links (GitHub/LinkedIn), and detailed performance analytics with Easy/Medium/Hard problem breakdown.

### ⚙️ Admin Dashboard
Robust management interface for creating and editing problems with dynamic test case management.

## 💻 Tech Stack

| Tier | Technologies |
|------|-------------|
| **Frontend** | React 18, Vite, Redux Toolkit, Tailwind CSS, Monaco Editor, Axios |
| **Backend** | Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt |
| **Compiler** | Docker, Node.js, Child Process API |
| **AI** | Groq SDK |

## 📂 Project Structure

```
CodeClash/
├── frontend/              # React + Vite
│   ├── src/
│   │   ├── components/    # Navbar, SubmissionModal, AdminRoute
│   │   ├── pages/         # LandingPage, Dashboard, Profile, Leaderboard, ProblemPage
│   │   └── store/         # Redux state management (Auth)
│   └── public/
│
├── backend/               # Node.js + Express API
│   ├── controllers/       # User, Problem, Submission logic
│   ├── models/            # MongoDB Schemas (User, Problem, Submission)
│   ├── routes/            # API endpoints
│   └── middleware/        # Authentication, Admin verification
│
└── compiler/              # Code Execution Engine
    ├── Dockerfile         # Language-specific images
    └── index.js           # Docker container management & evaluation
```

## ⚙️ Setup Instructions

### 1. Prerequisites

- **Node.js** (v18 or higher)
- **Docker** (installed and running)
- **MongoDB** (local instance or MongoDB Atlas)

### 2. Compiler Service Setup

```bash
# Navigate to compiler directory
cd compiler

# Install dependencies
npm install

# Ensure Docker is running
docker --version

# Start the compiler service
node index.js
# Default port: 8000
```

### 3. Backend API Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with the following variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
ADMIN_SECRET_KEY=your_admin_secret_key
COMPILER_URL=http://localhost:8000/execute

# Start the server
node index.js
# API will run on http://localhost:5000
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Application will run on http://localhost:5173
```

## 🎯 Usage

1. **Register/Login**: Create an account or sign in to access the platform
2. **Browse Problems**: Navigate to the Dashboard to view available coding challenges
3. **Solve Problems**: Select a problem, write your solution in the Monaco editor, and submit
4. **Get AI Help**: Use the AI Genie feature for hints when stuck
5. **Track Progress**: View your profile to see solved problems and performance statistics
6. **Compete**: Check the Leaderboard to see your global ranking

## 🔑 Admin Features

To access admin features, register with the admin secret key. Admins can:
- Create new coding problems
- Edit existing problems
- Manage test cases (sample and hidden)
- View all user submissions

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get single problem
- `POST /api/problems` - Create problem (Admin only)
- `PUT /api/problems/:id` - Update problem (Admin only)
- `DELETE /api/problems/:id` - Delete problem (Admin only)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/leaderboard` - Get leaderboard

### Submissions
- `POST /api/submissions` - Submit code for evaluation
- `GET /api/submissions/:id` - Get submission details
- `POST /api/submissions/hint` - Get AI hint for problem

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with Bcrypt
- Docker isolation for code execution
- Protected admin routes
- Environment variable configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for competitive programming enthusiasts

---

**Note**: Make sure all services (MongoDB, Docker, Compiler, Backend, Frontend) are running before using the application.
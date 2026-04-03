<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Isolated-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

<h1 align="center">CodeClash</h1>
<p align="center"><strong>The competitive programming arena where code meets competition.</strong></p>
<p align="center">Solve problems. Beat the clock. Climb the leaderboard. Get AI-powered hints when you're stuck.</p>

---

## What is CodeClash?

CodeClash is a full-stack online judge platform built with a decoupled three-tier architecture. Users write code in C++, Python, or Java, submit it against hidden test cases, and compete on a global leaderboard. An AI mentor (Genie) provides contextual hints without spoiling solutions.

**Live Architecture:**

```
Frontend (Vercel)  -->  Backend API (Render)  -->  MongoDB Atlas
                   -->  Compiler Service (AWS EC2 + Docker)
                   -->  AI Services (Groq + Google Generative AI)
```

## Features

### For Coders
- **Multi-language editor** — Monaco Editor with C++ 17, Python 3, and Java 17 support
- **Instant execution** — Run code with custom input before submitting
- **Hidden test case evaluation** — Submit against curated test cases with verdicts (Accepted, Wrong Answer, TLE, Runtime Error)
- **AI Genie Mentor** — Get problem simplifications, optimal approaches, edge case analysis, and starter code
- **Auto code review** — On wrong answers, Genie proactively analyzes your code and suggests fixes
- **Profile & stats** — Track problems solved by difficulty, accuracy rate, and submission history
- **Global leaderboard** — Compete with other developers worldwide

### For Admins
- **Problem management** — Create, edit, and delete problems with rich statements
- **Dynamic test cases** — Add/remove sample (public) and hidden test cases per problem
- **Admin dashboard** — Manage the entire problem arena from one place

### Technical Highlights
- **Docker-isolated execution** — Every code submission runs in a sandboxed container
- **2-second timeout** — Prevents infinite loops and resource abuse
- **JWT authentication** — Secure token-based auth with role-based access control
- **Three-tier decoupled architecture** — Frontend, Backend API, and Compiler service are independently deployable

## Tech Stack

| Layer | Stack |
|-------|-------|
| **Frontend** | React 19, Vite 7, Redux Toolkit, Tailwind CSS 3.4, Monaco Editor, Axios, React Router 7 |
| **Backend** | Node.js 18, Express 5, MongoDB + Mongoose, JWT, Bcryptjs |
| **Compiler** | Docker (Alpine), Node.js, g++, OpenJDK 17, Python 3 |
| **AI** | Groq SDK (Llama 3.3 70B), Google Generative AI |
| **Hosting** | Vercel (frontend), Render (backend), AWS ECR + EC2 (compiler) |

## Project Structure

```
CodeClash/
├── frontend/                   # React SPA (Port 5173)
│   ├── src/
│   │   ├── components/         # Navbar, SubmissionModal, SubmissionList, AdminRoute
│   │   ├── pages/              # Landing, Login, Register, Dashboard, ProblemDetail,
│   │   │                       # Profile, Leaderboard, Admin pages
│   │   ├── services/           # API layer (authService)
│   │   └── store/              # Redux slices (auth)
│   ├── vercel.json             # SPA routing for Vercel
│   └── .env.example
│
├── backend/                    # Express API (Port 5000)
│   ├── controllers/            # userController, problemController, submissionController
│   ├── models/                 # User, Problem, Submission schemas
│   ├── routes/                 # REST endpoints
│   ├── middlewares/            # JWT auth + admin role guard
│   ├── config/                 # MongoDB connection
│   ├── render.yaml             # Render.com deploy config
│   └── .env.example
│
├── compiler/                   # Code Execution Service (Port 8000)
│   ├── executeCpp.js           # C++ compile & run
│   ├── executePython.js        # Python 3 execution
│   ├── executeJava.js          # Java 17 execution
│   ├── generateAiResponse.js   # AI code review (Google GenAI)
│   ├── genieExplanation.js     # AI hints (Groq)
│   ├── Dockerfile              # Multi-language Docker image
│   └── .env.example
│
└── DEPLOYMENT.md               # Full deployment guide (Vercel + Render + AWS)
```

## Quick Start

### Prerequisites
- Node.js 18+
- Docker (for compiler service)
- MongoDB (local or Atlas)
- Groq API key + Google Generative AI key

### 1. Clone & install

```bash
git clone https://github.com/yourusername/CodeClash.git
cd CodeClash
```

### Docker Setup (One Command)

```bash
docker-compose up --build
```
This starts **everything** — MongoDB, backend, compiler, and frontend. Visit `http://localhost:5173` once it's up. Seed problems with `docker exec -it codeclash-backend node seed.js`.

---

### Manual Setup

### 2. Start the Compiler

```bash
cd compiler
npm install
cp .env.example .env          # Add your API keys
node index.js                 # Runs on :8000
```

Or with Docker:
```bash
docker build -t codeclash-compiler .
docker run -p 8000:8000 --env-file .env codeclash-compiler
```

### 3. Start the Backend

```bash
cd backend
npm install
cp .env.example .env          # Add MongoDB URI, JWT secret
node index.js                 # Runs on :5000
```

### 4. Start the Frontend

```bash
cd frontend
npm install
cp .env.example .env          # Set VITE_BACKEND_URL and VITE_COMPILER_URL
npm run dev                   # Runs on :5173
```

### 5. Seed problems (optional)

```bash
cd backend
node seed.js                  # Populates the database with starter problems
```

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register (pass `adminSecret` for admin role) |
| POST | `/api/users/login` | Login, returns JWT |
| GET | `/api/users/me` | Get current user (protected) |

### Problems
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/problems` | List all problems |
| GET | `/api/problems/:id` | Get problem by ID |
| POST | `/api/problems` | Create problem (admin) |
| PUT | `/api/problems/:id` | Update problem (admin) |
| DELETE | `/api/problems/:id` | Delete problem (admin) |

### Submissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/submissions` | Submit code (protected) |
| GET | `/api/submissions/user` | Get user's submissions (protected) |
| GET | `/api/submissions/:id` | Get submission details (protected) |

### Compiler
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/run` | Execute code with input |
| POST | `/ai-review` | AI code review |
| POST | `/genieExplain` | AI Genie hints |

## Environment Variables

### Frontend (`frontend/.env`)
```
VITE_BACKEND_URL=http://localhost:5000
VITE_COMPILER_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
ADMIN_SECRET_KEY=CodeClash_Secret_99
FRONTEND_URL=http://localhost:5173
PORT=5000
```

### Compiler (`compiler/.env`)
```
PORT=8000
FRONTEND_URL=http://localhost:5173
GROQ_API_KEY=your_key
GOOGLE_API_KEY=your_key
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full deployment guide covering:
- Frontend on **Vercel**
- Backend on **Render.com**
- Compiler on **AWS ECR + EC2**

## License

MIT

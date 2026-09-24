# 🌟 SkillSwap – Peer Skill Exchange Platform

SkillSwap is a full-stack student-centric web application engineered to enable students to **teach the skills they know and learn the skills they want**. Powered by an intelligent matching algorithm, SkillSwap pairs students based on reciprocal skills, proficiency levels, and mutual interests without any financial barrier.

---

## 🚀 Key Features

- **🔐 Robust JWT Authentication & Security**: Password hashing with `bcryptjs`, JWT token management, protected API routes, and React Router auth guards.
- **⚡ Smart Skill Matching Engine**:
  - Compares User A's teaching skills with User B's learning desires (and vice versa).
  - Calculates a normalized **Match Percentage (0–100%)** based on teaching crossovers, reciprocal mutual swaps, and level compatibility.
  - Highlights **"Mutual Match"** badges for two-way exchanges.
- **🎯 Dynamic Skills Portfolio**:
  - Add, edit, and delete skills dynamically for both **"Skills I Teach"** and **"Skills I Want to Learn"**.
  - Proficiency grading: *Beginner*, *Intermediate*, *Advanced*.
  - Instant popular skill suggestion chips.
- **🔍 Find Matches & Peer Discovery**:
  - Live search by student name, college, or skill topic.
  - Multi-attribute filters (Skill, Proficiency Level, College, Mutual Matches Only).
- **🤝 Connection & Networking System**:
  - Send, accept, and decline connection requests with customized intro notes.
  - Track pending invitations and active peer connections.
- **💬 Direct Peer Messaging**:
  - Clean real-time messaging view with timestamps, unread tracking, and conversation history.
- **📅 Session Scheduling & Virtual Rooms**:
  - Propose date, time, duration (30/45/60/90 min), and role (Learner / Teacher).
  - Status lifecycle: `Pending` &rarr; `Accepted` &rarr; `Completed` / `Cancelled`.
  - Integrated meeting links (e.g. Jitsi Meet / video room links).
- **⭐ Verified Peer Reviews & Ratings**:
  - Leave 1–5 star ratings and written reviews after completing exchange sessions.
  - Dynamic user score calculation displayed on public peer profiles.
- **🌱 Instant Database Seeding**: Pre-loaded with realistic student peer profiles with reciprocal skills for instant live demonstration.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), React Router DOM v6, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas / Local MongoDB, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **Configuration** | Dotenv (`.env`) |

---

## 📁 Project Structure

```text
SkillSwap/
│
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── cards/          # MatchCard, SessionCard, MessageBubble, ReviewCard
│   │   │   └── common/         # Navbar, Sidebar, Button, Input, Modal, SkillTag, etc.
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── layouts/            # PublicLayout, DashboardLayout
│   │   ├── pages/
│   │   │   ├── dashboard/      # Dashboard, FindMatches, MySkills, MyProfile, Sessions, Messages, Settings
│   │   │   └── public/         # HomePage, AboutPage, LoginPage, RegisterPage
│   │   ├── services/           # Axios API configuration & endpoint helpers
│   │   ├── App.jsx             # Route definitions & auth protection
│   │   ├── main.jsx            # React root mounting
│   │   └── index.css           # Tailwind directives & glassmorphism
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend Application (Node.js + Express)
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose connection
│   ├── controllers/            # Auth, User, Skill, Match, Connection, Message, Session, Review
│   ├── middleware/             # JWT auth protection & global error handler
│   ├── models/                 # User, Connection, Message, Session, Review
│   ├── routes/                 # Express REST API routes
│   ├── seed/
│   │   └── seedData.js         # Demo database population script
│   ├── utils/
│   │   └── matchingAlgorithm.js # Smart matching algorithm
│   ├── server.js               # Express server entry point
│   ├── package.json
│   └── .env.example
│
├── .gitignore
├── .env.example
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (MongoDB Atlas cluster or local `mongodb://127.0.0.1:27017/skillswap`)

---

### Step 1: Clone the Repository & Configure Backend

1. Navigate to the `server/` directory:
   ```bash
   cd server
   npm install
   ```

2. Configure environment variables in `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/skillswap
   JWT_SECRET=skillswap_jwt_super_secret_key_2026_peer_exchange
   JWT_EXPIRE=30d
   ```
   *(For MongoDB Atlas, replace `MONGODB_URI` with your connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/skillswap?retryWrites=true&w=majority`)*

---

### Step 2: Seed Sample Demo Data (Optional but Recommended)

Populate the database with pre-configured mutual matching peers (e.g. Aarav: Java &rarr; React, Priya: React &rarr; Java, Rohan: Python &rarr; ML):

```bash
cd server
npm run seed
```

#### Demo Accounts Table:

| Name | Email | Password | Teaches | Wants to Learn |
|---|---|---|---|---|
| **Aarav Sharma** | `aarav@skillswap.edu` | `password123` | Java, Spring Boot, SQL | React, Tailwind CSS |
| **Priya Patel** | `priya@skillswap.edu` | `password123` | React, JavaScript, Tailwind | Java, Spring Boot |
| **Rohan Verma** | `rohan@skillswap.edu` | `password123` | Python, Data Structures | Machine Learning |
| **Ananya Gupta** | `ananya@skillswap.edu` | `password123` | Machine Learning, AI | Python, C++ |

---

### Step 3: Configure & Start Frontend

1. Open a new terminal and navigate to `client/`:
   ```bash
   cd client
   npm install
   ```

2. Verify `client/.env` has the backend URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Frontend will run at:* `http://localhost:5173`

---

### Step 4: Start Backend Server

```bash
cd server
npm run dev
```
*Backend API will run at:* `http://localhost:5000`  
*Health Check:* `http://localhost:5000/api/health`

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register a new student account
- `POST /api/auth/login` — Log in and receive JWT token
- `GET /api/auth/me` — Retrieve current authenticated user profile
- `PUT /api/auth/updatepassword` — Change password securely

### Users & Profiles
- `GET /api/users/profile` — Get logged-in user profile with reviews
- `PUT /api/users/profile` — Update bio, college, avatar, and availability timings
- `GET /api/users/:id` — View public peer profile with match score and reviews
- `GET /api/users` — Search and filter users by skill, level, college

### Skills Management
- `GET /api/skills` — Get user's teaching and learning skills
- `POST /api/skills/teach` — Add skill to teach
- `DELETE /api/skills/teach/:skillName` — Remove skill to teach
- `POST /api/skills/learn` — Add skill to learn
- `DELETE /api/skills/learn/:skillName` — Remove skill to learn
- `PUT /api/skills` — Bulk update skills

### Smart Matching
- `GET /api/matches` — Compute and retrieve ranked matches with compatibility scores

### Connections
- `POST /api/connections/request` — Send connection request
- `GET /api/connections/requests` — View pending sent & received requests
- `GET /api/connections` — Get accepted connections list
- `PUT /api/connections/:id/accept` — Accept incoming connection request
- `PUT /api/connections/:id/reject` — Reject incoming connection request

### Direct Messaging
- `GET /api/messages/conversations` — Retrieve all active message threads
- `GET /api/messages/:userId` — Fetch conversation message history with a peer
- `POST /api/messages` — Send direct message

### Sessions & Scheduling
- `POST /api/sessions` — Schedule a 1-on-1 session
- `GET /api/sessions` — Get user's sessions (as teacher or learner)
- `PUT /api/sessions/:id/accept` — Accept session proposal
- `PUT /api/sessions/:id/cancel` — Cancel session
- `PUT /api/sessions/:id/complete` — Mark session as completed

### Reviews & Ratings
- `POST /api/reviews` — Submit 1–5 star rating and feedback for completed session
- `GET /api/reviews/user/:userId` — Get all reviews for a specific user

---

## 🧠 Smart Matching Algorithm Breakdown

The algorithm in [`server/utils/matchingAlgorithm.js`](file:///server/utils/matchingAlgorithm.js) operates through a multi-factor compatibility model:

1. **Forward Match ($F$)**: Identifies skills the candidate teaches that the current user wants to learn. Evaluates proficiency level compatibility (e.g. Advanced instructor mentoring Beginner learner yields bonus weight).
2. **Reverse Mutual Match ($R$)**: Identifies skills the current user teaches that the candidate wants to learn.
3. **Mutual Synergy Bonus**: When both $F > 0$ and $R > 0$, a 20% synergy bonus is granted to prioritize two-way skill swaps.
4. **Affinity Weights**: Small bonuses are added for campus/college affinity and verified high peer ratings.
5. **Normalization**: Scores are mapped to a 0–99% scale.

---

## 🔮 Future Roadmap

- [ ] WebRTC direct in-app video and audio calls with shared code editor / whiteboard.
- [ ] Group skill study circles and hackathon team matching.
- [ ] Calendar integration (Google Calendar / iCal export).
- [ ] Skill certificate badges upon reaching milestone verified hours.

---

## 📄 License
This project is licensed under the MIT License - free for academic and personal use.

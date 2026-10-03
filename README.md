# CivicDesk – Complaint Management System

A full-stack Complaint Management System built with **Node.js**, **Express.js**, **MongoDB** (Mongoose), and **React** (Vite).

---

## 📁 Project Structure

```
BACKEND FINAL PROJECT/
├── backend/                    # Express.js REST API
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, login, profile
│   │   └── complaintController.js  # CRUD + stats
│   ├── middleware/
│   │   ├── auth.js             # JWT protect + moderatorOnly
│   │   ├── ownership.js        # Complaint ownership check
│   │   └── validate.js         # express-validator handler
│   ├── models/
│   │   ├── User.js             # User schema (citizen/moderator)
│   │   └── Complaint.js        # Complaint schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── complaintRoutes.js
│   ├── .env                    # ← Fill in your MongoDB URI & JWT secret
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Entry point
│
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── ComplaintCard.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx           # Citizen view
│   │   │   ├── NewComplaint.jsx
│   │   │   ├── ComplaintDetail.jsx
│   │   │   └── ModeratorDashboard.jsx  # Moderator view
│   │   ├── services/
│   │   │   └── api.js                  # Axios + interceptors
│   │   ├── utils/
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css               # Full design system
│   └── vite.config.js
│
└── CivicDesk-API.postman_collection.json
```

---

## ⚙️ Setup

### 1. Configure Environment

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/complaint-management
JWT_SECRET=your_strong_secret_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 2. Start the Backend
```bash
cd backend
npm run dev    # uses nodemon for hot reload
```

### 3. Start the Frontend
```bash
cd frontend
npm run dev    # runs on http://localhost:3000
```

---

## 🔌 API Endpoints

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register citizen or moderator |
| POST | `/api/auth/login` | Public | Login & get JWT |
| GET | `/api/auth/me` | Private | Get current user profile |

### Complaints
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/complaints` | Private | Create complaint |
| GET | `/api/complaints/my` | Citizen | Get own complaints (filterable) |
| GET | `/api/complaints` | Moderator | Get all complaints (filterable) |
| GET | `/api/complaints/stats` | Moderator | Get complaint statistics |
| GET | `/api/complaints/:id` | Owner or Moderator | Get complaint details |
| PATCH | `/api/complaints/:id/status` | Moderator | Update status + add note |
| DELETE | `/api/complaints/:id` | Owner or Moderator | Delete complaint |

### Query Parameters (filtering)
- `?category=water|electricity|roads|sanitation|parks|other`
- `?status=pending|in-progress|resolved|rejected`
- `?page=1&limit=10`

---

## 🔐 Auth Flow

All protected routes require:
```
Authorization: Bearer <JWT_TOKEN>
```

Tokens expire after **7 days** (configurable via `JWT_EXPIRE`).

---

## 🚀 Deployment

### Backend (Render / Railway)
Set environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL`

### Frontend (Vercel / Netlify)
Set `VITE_API_BASE_URL=https://your-backend-url.com/api`

---

## 📬 Postman Collection

Import `CivicDesk-API.postman_collection.json` into Postman or Thunder Client.
Set the `token` collection variable after login.

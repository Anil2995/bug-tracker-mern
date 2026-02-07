# 🐛 Bug Tracker Pro - MERN Stack

<div align="center">

![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![MERN](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![Completion](https://img.shields.io/badge/Completion-100%25-brightgreen?style=for-the-badge)

**A complete, production-ready bug tracking application built with the MERN stack**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Docs](#-api-documentation) • [Usage](#-usage)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

A full-featured bug tracking and project management system similar to Jira, built from scratch using the MERN stack. This application demonstrates advanced full-stack development skills including:

- JWT-based authentication with bcrypt password hashing
- RESTful API design with 25 endpoints
- Drag-and-drop Kanban board using React Beautiful DnD
- Real-time collaboration with comments
- File upload functionality with Multer
- Role-based access control (Admin/Member)
- Advanced filtering and search
- Responsive, modern UI with Tailwind CSS and glassmorphism design

**Project Metrics:**
- 📁 50+ Files Created
- 💻 6,500+ Lines of Code
- 🔌 25 API Endpoints
- ⭐ 80+ Features
- ✅ 100% Requirements Met

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration with email validation
- Secure login with JWT tokens
- Password hashing with bcryptjs
- Protected routes (frontend & backend)
- Role-based permissions (Admin/Member)
- Auto-logout on token expiration

### 📊 Project Management
- Create, edit, delete projects
- Add/remove team members
- Project admin privileges
- Project status tracking
- Team member management
- Project statistics dashboard

### 🎫 Ticket Management
- Create tickets with title, description, priority, due date
- Assign tickets to team members
- Update ticket status (To-Do, In Progress, Done)
- Priority levels (Low, Medium, High)
- Edit and delete tickets
- Ticket filtering and sorting
- My Tickets view
- Created by Me view

### 📌 Kanban Board
- Drag-and-drop functionality
- 3 status columns (To-Do, In Progress, Done)
- Visual priority indicators
- Auto-save on drag
- Smooth animations
- Empty state handling
- Mobile responsive

### 💬 Comments System
- Add comments to tickets
- Edit own comments
- Delete own comments
- Real-time updates
- User avatars and timestamps
- Character counter
- Permission-based actions

### 📎 File Upload
- Upload screenshots/attachments to tickets
- Image preview grid
- File type validation (JPEG, PNG, GIF, WebP)
- File size limit (5MB)
- Download/view attachments
- Delete attachments
- Progress tracking during upload

### 🔍 Filter & Search
- Filter by status (To-Do, In Progress, Done)
- Filter by priority (Low, Medium, High)
- Filter by assignee
- Sort by newest/oldest
- Sort by priority
- Sort by due date
- Real-time filter results

### 🎨 UI/UX Features
- Glassmorphism design
- Smooth animations and transitions
- Responsive layout (mobile, tablet, desktop)
- Intuitive navigation
- Loading states
- Error handling
- Success/error messages
- Empty states
- Modal dialogs

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js** - UI library
- **React Router** - Client-side routing
- **Context API** - Global state management
- **Axios** - HTTP requests
- **Tailwind CSS** - Utility-first CSS
- **React Beautiful DnD** - Drag-and-drop
- **Vite** - Build tool

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

---

## 📂 Project Structure

```
bug-tracker-mern/
├── backend/                    # Backend application
│   ├── controllers/           # Business logic
│   │   ├── authController.js     # Authentication
│   │   ├── projectController.js  # Project CRUD
│   │   ├── ticketController.js   # Ticket CRUD + File Upload
│   │   └── commentController.js  # Comment CRUD
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js               # JWT verification
│   │   └── upload.js             # Multer config
│   ├── models/                # Database schemas
│   │   ├── User.js               # User model
│   │   ├── Project.js            # Project model
│   │   ├── Ticket.js             # Ticket model (with attachments)
│   │   └── Comment.js            # Comment model
│   ├── routes/                # API routes
│   │   ├── auth.js               # Auth routes
│   │   ├── projects.js           # Project routes
│   │   ├── tickets.js            # Ticket routes + upload
│   │   └── comments.js           # Comment routes
│   ├── uploads/               # Uploaded files (gitignored)
│   ├── .env.example           # Environment template
│   ├── server.js              # Entry point
│   └── package.json
│
├── frontend/                   # Frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── TicketCard.jsx
│   │   │   ├── TicketForm.jsx
│   │   │   ├── TicketDetailModal.jsx  # With file upload
│   │   │   ├── CommentSection.jsx
│   │   │   └── KanbanBoard.jsx
│   │   ├── context/           # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   ├── MyTickets.jsx
│   │   │   └── KanbanView.jsx
│   │   ├── services/          # API calls
│   │   │   └── api.js
│   │   ├── App.jsx            # Main app
│   │   ├── index.css          # Global styles
│   │   └── main.jsx
│   ├── tailwind.config.js     # Tailwind config
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore                 # Git ignore patterns
└── README.md                  # This file
```

---

## 🚀 Installation

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### **1. Clone Repository**
```bash
git clone <your-repo-url>
cd bug-tracker-mern
```

### **2. Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/bug-tracker
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bug-tracker

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

Start backend server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### **3. Frontend Setup**
```bash
cd frontend
npm install
```

Start frontend:
```bash
npm run dev
# App runs on http://localhost:5173
```

### **4. Seed Demo Data (Optional but Recommended)**
```bash
cd backend
npm run seed
```

This creates demo users, projects, tickets, and comments for testing. After seeding, you can login with the demo credentials below.

### **5. Access Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- API Documentation: See [API Docs](#-api-documentation)

---

## 🔐 Demo Login Credentials

After running `npm run seed` in the backend, you can login with these accounts:

| Role | Email | Password |
|------|-------|----------|
| **Demo User** | `demo@bugtracker.com` | `demo123` |
| **Admin** | `sarah@bugtracker.com` | `demo123` |
| **Developer** | `alex@bugtracker.com` | `demo123` |
| **Developer** | `mike@bugtracker.com` | `demo123` |
| **Developer** | `emily@bugtracker.com` | `demo123` |
| **Designer** | `lisa@bugtracker.com` | `demo123` |
| **QA Engineer** | `david@bugtracker.com` | `demo123` |
| **Project Manager** | `jennifer@bugtracker.com` | `demo123` |

### Demo Data Includes:
- ✅ **8 Users** with realistic names and roles
- ✅ **10 Projects** (E-Commerce, Banking, Healthcare, AI, LMS, Real Estate, Food Delivery, Fitness, Project Management, Social Media)
- ✅ **66+ Tickets** with various priorities, statuses, and due dates
- ✅ **37+ Comments** demonstrating team collaboration

---

## ⚙️ Configuration

### **Environment Variables**

#### Backend (.env)
```env
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
PORT=5000
NODE_ENV=development
```

#### Frontend (vite config)
Update API URL in `frontend/src/services/api.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
// Change to your deployed backend URL in production
```

---

## 🎮 Usage

### **1. Register/Login**
- Create a new account or login with existing credentials
- JWT token stored in localStorage
- Auto-redirect to dashboard on login

### **2. Create a Project**
- Click "New Project" button
- Fill in project details (title, description)
- You become the admin of your project

### **3. Add Team Members**
- Open project details
- Click "Add Team Member"
- Enter team member email
- They must be registered users

### **4. Create Tickets**
- Inside a project, click "New Ticket"
- Set title, description, priority, assignee, due date
- Ticket appears in the list

### **5. Use Kanban Board**
- Click "Kanban View" tab
- Drag tickets between columns
- Status updates automatically

### **6. Upload Screenshots**
- Click on any ticket to open details
- Scroll to "Attachments" section
- Click "Choose File" and select image
- Click "Upload" to attach screenshot

### **7. Add Comments**
- Open ticket details
- Scroll to comments section
- Type comment and click "Post"
- Edit/delete your own comments

### **8. Filter & Sort**
- Use filter dropdowns on project page
- Filter by status, priority, or assignee
- Sort by newest, oldest, priority, or due date

---

## 📡 API Documentation

### **Base URL**
```
http://localhost:5000/api
```

### **Authentication Endpoints**

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "user": { ... }
}
```

### **Project Endpoints**

#### Get All Projects
```http
GET /projects
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "count": 5,
  "data": [ ... ]
}
```

#### Get Single Project
```http
GET /projects/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": { ... },
  "isAdmin": true
}
```

#### Create Project
```http
POST /projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Project",
  "description": "Project description",
  "status": "active"
}

Response: 201 Created
```

#### Update Project
```http
PUT /projects/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title"
}

Response: 200 OK
```

#### Delete Project
```http
DELETE /projects/:id
Authorization: Bearer {token}

Response: 200 OK
```

#### Add Team Member
```http
POST /projects/:id/members
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "member@example.com"
}

Response: 200 OK
```

#### Remove Team Member
```http
DELETE /projects/:id/members/:memberId
Authorization: Bearer {token}

Response: 200 OK
```

### **Ticket Endpoints**

#### Get Project Tickets
```http
GET /tickets/project/:projectId?status=to-do&priority=high&sortBy=newest
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "count": 10,
  "data": [ ... ]
}
```

#### Get Single Ticket
```http
GET /tickets/:id
Authorization: Bearer {token}

Response: 200 OK
```

#### Create Ticket
```http
POST /tickets
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Bug in login page",
  "description": "Description here",
  "priority": "high",
  "status": "to-do",
  "project": "project_id",
  "assignedTo": "user_id",
  "dueDate": "2026-02-01"
}

Response: 201 Created
```

#### Update Ticket
```http
PUT /tickets/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "in-progress"
}

Response: 200 OK
```

#### Delete Ticket
```http
DELETE /tickets/:id
Authorization: Bearer {token}

Response: 200 OK
```

#### Upload Attachment
```http
POST /tickets/:id/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body: FormData with 'file' field

Response: 200 OK
{
  "success": true,
  "message": "File uploaded successfully",
  "data": { ... }
}
```

#### Delete Attachment
```http
DELETE /tickets/:id/attachments/:attachmentId
Authorization: Bearer {token}

Response: 200 OK
```

#### Get My Tickets
```http
GET /tickets/my-tickets
Authorization: Bearer {token}

Response: 200 OK
```

#### Get Created Tickets
```http
GET /tickets/created-by-me
Authorization: Bearer {token}

Response: 200 OK
```

#### Get Project Stats
```http
GET /tickets/project/:projectId/stats
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "total": 15,
    "byStatus": { ... },
    "byPriority": { ... }
  }
}
```

### **Comment Endpoints**

#### Get Ticket Comments
```http
GET /comments/ticket/:ticketId
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "count": 5,
  "data": [ ... ]
}
```

#### Create Comment
```http
POST /comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "ticket": "ticket_id",
  "text": "This is a comment"
}

Response: 201 Created
```

#### Update Comment
```http
PUT /comments/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "Updated comment"
}

Response: 200 OK
```

#### Delete Comment
```http
DELETE /comments/:id
Authorization: Bearer {token}

Response: 200 OK
```

---

## 🗄️ Database Schema

### **User Model**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### **Project Model**
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  status: String (enum: ['active', 'completed', 'archived']),
  admin: ObjectId (ref: User),
  teamMembers: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### **Ticket Model**
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  priority: String (enum: ['low', 'medium', 'high']),
  status: String (enum: ['to-do', 'in-progress', 'done']),
  project: ObjectId (ref: Project),
  createdBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  dueDate: Date,
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    uploadedAt: Date,
    uploadedBy: ObjectId (ref: User)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### **Comment Model**
```javascript
{
  _id: ObjectId,
  ticket: ObjectId (ref: Ticket),
  user: ObjectId (ref: User),
  text: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*Beautiful dashboard showing project statistics, quick actions, and recent activity*

### Project List
![Project List](./screenshots/project-list.png)
*Grid view of all projects with status indicators and team member count*

### Kanban Board
![Kanban Board](./screenshots/kanban.png)
*Drag-and-drop interface with three columns (To-Do, In Progress, Done) featuring smooth animations*

### Ticket Details
![Ticket Details](./screenshots/ticket-details.png)
*Modal showing complete ticket information including comments and file attachments with upload functionality*

### File Upload
![Upload](./screenshots/upload.png)
*Image preview grid showing uploaded screenshots with delete buttons on hover*

### Comments Section
![Comments](./screenshots/comments.png)
*Real-time collaboration with inline editing and character counter*

### Filter & Search
![Filter](./screenshots/filter.png)
*Advanced filtering by status, priority, assignee with multiple sort options*

### Responsive Design
![Mobile](./screenshots/mobile.png)
*Fully responsive layout working seamlessly on mobile, tablet, and desktop*

---

## 🌐 Deployment

### **Backend Deployment (Render/Railway)**

1. **Create Account** on Render or Railway
2. **Connect GitHub** repository (point to `backend` folder)
3. **Add Environment Variables:**
   - `MONGODB_URI` - MongoDB Atlas connection string
   - `JWT_SECRET` - Your secure secret key (generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
   - `NODE_ENV=production`
   - `FRONTEND_URL` - Your deployed frontend URL (e.g., `https://your-app.vercel.app`) - **Required for CORS**
4. **Set Build Command:** `npm install`
5. **Set Start Command:** `npm start`
6. **Set Root Directory:** `backend`
7. **Deploy** and note the URL (e.g., `https://your-backend.onrender.com`)

### **Frontend Deployment (Vercel/Netlify)**

1. **Create Account** on Vercel or Netlify
2. **Import Project** from GitHub (point to `frontend` folder)
3. **Set Environment Variables:**
   - `VITE_API_URL` - Your backend URL + `/api` (e.g., `https://your-backend.onrender.com/api`)
4. **Set Build Settings:**
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Root Directory: `frontend`
5. **Deploy** and access your live app!

> **Note:** After frontend deployment, copy the URL and add it as `FRONTEND_URL` in your backend environment variables to enable CORS.

### **Database (MongoDB Atlas)**

1. **Create Free Cluster** at mongodb.com/cloud/atlas
2. **Create Database User**
3. **Whitelist IP** (0.0.0.0/0 for all IPs, or use Render/Railway IP addresses)
4. **Get Connection String**
5. **Add to Backend ENV** as `MONGODB_URI`

### **Quick Deployment Checklist**

- [ ] MongoDB Atlas cluster created and connection string ready
- [ ] Backend deployed with all environment variables set
- [ ] Frontend deployed with `VITE_API_URL` pointing to backend
- [ ] Backend `FRONTEND_URL` updated with frontend URL
- [ ] Run `npm run seed` (optional) to populate demo data

---


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 Requirements Met

### ✅ All 10 Use Cases Implemented

1. ✅ **User Authentication** - JWT auth with protected routes
2. ✅ **Project Management** - Full CRUD with team management
3. ✅ **Create Issue** - Ticket creation with all fields
4. ✅ **Assign Users** - Dropdown of team members
5. ✅ **Kanban Board** - Drag-and-drop with React Beautiful DnD
6. ✅ **Comments** - Full CRUD with real-time updates
7. ✅ **Filter & Search** - Multiple filters and sort options
8. ✅ **Edit/Delete Tickets** - Full CRUD operations
9. ✅ **Role-Based Access** - Admin vs Member permissions
10. ✅ **Upload Screenshot** - File upload with Multer

**Completion: 100% ✅**

---

## 🏆 Project Highlights

- **Production-Ready Code** - Clean, organized, well-documented
- **Security Best Practices** - JWT, bcrypt, Helmet, CORS
- **Modern UI/UX** - Glassmorphism, animations, responsive
- **Advanced Features** - Drag-and-drop, file upload, real-time collaboration
- **Scalable Architecture** - RESTful API, component-based frontend
- **Complete Documentation** - API docs, setup guide, usage instructions

---

## 📧 Contact

For questions or opportunities, please reach out:

**Siddem Anil Kumar**

- 🐙 **GitHub:** [Anil2995](https://github.com/Anil2995)
- 💼 **LinkedIn:** [Siddem Anil Kumar](https://www.linkedin.com/in/anilkumar05/)
- 📧 **Email:** siddemanilkumar@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using the MERN Stack**

⭐ Star this repo if you found it helpful!

</div>

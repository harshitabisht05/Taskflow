# TaskFlow — Full-Stack Kanban Project Management App

TaskFlow is a full-stack Kanban project management application designed to help users create projects, organize tasks, track progress, and collaborate through team-based projects.

The application supports personal and team projects, task assignment, role-based permissions, drag-and-drop task management, project progress tracking, filtering, and dashboard analytics.

## Live Demo

**Frontend:** Add your deployed frontend URL here

**Backend API:** https://taskflow-backend-kappa.vercel.app

---

## Features

### Authentication

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected application routes
- Persistent authentication
- Secure logout functionality

### Project Management

- Create projects
- Edit project details
- Delete projects
- Set project status
- Set project due dates
- Personal and team project types
- Project progress tracking
- Overdue project indicators

### Kanban Task Management

Tasks are organized into four workflow stages:

- To Do
- In Progress
- Review
- Done

Users can:

- Create tasks
- Edit task details
- Delete tasks
- Set task priority
- Set due dates
- Move tasks between Kanban columns
- Reorder tasks using drag-and-drop
- Persist task status and position after refresh

### Team Collaboration

Team projects support:

- Adding registered users as project members
- Removing project members
- Assigning tasks to team members
- Displaying assigned users on tasks
- Team lead and team member permissions

Team leads can manage the project, members, and tasks.

Team members can update the status of tasks assigned to them while project-level management remains restricted to the project owner.

### Search and Filtering

Tasks can be filtered using:

- Text search
- Priority
- Status
- Overdue tasks
- Tasks without due dates

Multiple filters can be combined and cleared when needed.

### Dashboard

The dashboard provides an overview of project activity, including:

- Total projects
- Total tasks
- Completed tasks
- Tasks in progress
- Recent projects
- Individual project progress

Project progress is calculated using completed tasks:

```text
Completed Tasks / Total Tasks × 100
```

### User Experience

- Responsive layout
- Loading states
- Empty states
- API error feedback
- Form validation
- Mutation loading states
- Duplicate submission prevention
- Overdue indicators
- Confirmation before destructive actions

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Axios
- TanStack Query
- dnd-kit

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt

### Deployment

- Vercel
- MongoDB Atlas

---

## Application Architecture

TaskFlow follows a client-server architecture:

```text
React Frontend
      |
      | HTTP / REST API
      |
      v
Node.js + Express Backend
      |
      | Mongoose
      |
      v
MongoDB Atlas
```

The frontend communicates with the backend through REST APIs using Axios.

TanStack Query manages server state, caching, API loading states, mutations, and cache invalidation.

---

## Core User Flow

```text
Register / Login
       |
       v
Dashboard
       |
       v
Create Project
       |
       v
Open Project
       |
       v
Kanban Board
       |
       +---- Create Task
       |
       +---- Edit Task
       |
       +---- Delete Task
       |
       +---- Drag Task Between Columns
       |
       +---- Search / Filter Tasks
       |
       +---- Track Project Progress
```

For team projects:

```text
Create Team Project
       |
       v
Add Team Members
       |
       v
Assign Tasks
       |
       v
Team Member Updates Assigned Task Status
       |
       v
Project Progress Updates
```

---

## Project Structure

The project is divided into separate frontend and backend applications.

```text
TaskFlow/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   └── kanban/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   │
│   └── package.json
│
└── README.md
```

> The exact structure may vary slightly depending on the final repository organization.

---

## API Overview

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Projects

```http
GET    /api/projects
POST   /api/projects
GET    /api/projects/:projectId
PUT    /api/projects/:projectId
DELETE /api/projects/:projectId
```

### Team Members

```http
POST   /api/projects/:projectId/members
DELETE /api/projects/:projectId/members/:memberId
```

### Tasks

```http
GET    /api/projects/:projectId/tasks
POST   /api/projects/:projectId/tasks
PUT    /api/projects/:projectId/tasks/:taskId
DELETE /api/projects/:projectId/tasks/:taskId
```

Task reordering is handled through the task API to persist Kanban status and position changes.

---

## Role-Based Permissions

TaskFlow implements project-level authorization for team collaboration.

### Project Lead

The project owner can:

- Edit project details
- Delete the project
- Add team members
- Remove team members
- Create tasks
- Edit tasks
- Delete tasks
- Assign tasks
- Reorder tasks
- Move tasks between workflow stages

### Team Member

A team member can:

- Access team projects they belong to
- View project tasks
- View assigned tasks
- Update the status of tasks assigned to them

Project management actions remain restricted to the project owner.

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

You will also need a MongoDB database.

---

## Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into the project directory:

```bash
cd TaskFlow
```

---

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=http://localhost:5173
```

Do not commit your `.env` file or expose production secrets in the repository.

Start the backend development server:

```bash
npm run dev
```

The backend should run on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

---

## Environment Variables

### Backend

| Variable | Description |
| --- | --- |
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWT authentication tokens |
| `FRONTEND_URL` | Allowed frontend origin for CORS |

### Frontend

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Base URL for the TaskFlow backend API |

Production environment variables should be configured directly in the deployment platform.

---

## Drag-and-Drop Implementation

TaskFlow uses `dnd-kit` for Kanban drag-and-drop functionality.

When a task is moved:

1. The frontend determines the target task or column.
2. The task's status and/or position is updated.
3. TanStack Query updates the UI state.
4. The new ordering is persisted through the backend API.
5. Failed mutations trigger a query refresh to restore server state.

This provides responsive interactions while keeping MongoDB as the source of truth.

---

## Server State Management

TaskFlow uses TanStack Query to manage API data.

It is responsible for:

- Fetching projects
- Fetching tasks
- Caching server data
- Managing mutations
- Tracking loading states
- Handling API errors
- Invalidating stale queries
- Refreshing dashboard statistics

For example, after a task is completed, relevant task, project, and dashboard queries are invalidated so progress information remains synchronized.

---

## Security

The application includes:

- Hashed user passwords
- JWT authentication
- Protected backend routes
- Project ownership checks
- Team membership validation
- Task assignment validation
- Role-based project permissions
- Environment-based secrets

Sensitive environment variables are not stored in the frontend application.

---

## Screenshots

Add screenshots of the final application here.

### Dashboard

```text
Add screenshot here
```

### Kanban Board

```text
Add screenshot here
```

### Team Project

```text
Add screenshot here
```

### Task Management

```text
Add screenshot here
```

You can store screenshots in a directory such as:

```text
docs/screenshots/
```

Then display them in this README using relative image paths.

---

## Testing

The following core flows have been manually tested:

- Registration
- Login and logout
- Protected routes
- Project creation
- Project editing
- Project deletion
- Task creation
- Task editing
- Task deletion
- Kanban drag-and-drop
- Task ordering persistence
- Team member management
- Task assignment
- Team member permissions
- Search and filtering
- Dashboard statistics
- Project progress tracking
- Responsive layouts
- Production API integration
- CORS configuration
- Production deployment

---

## Challenges and Learnings

Building TaskFlow involved solving several full-stack development challenges, including:

- Designing REST APIs for projects and tasks
- Managing server state with TanStack Query
- Synchronizing Kanban drag-and-drop state with MongoDB
- Implementing role-based permissions for team projects
- Preventing unauthorized task and project modifications
- Managing project and task relationships in MongoDB
- Calculating project progress efficiently
- Handling frontend and backend deployment separately
- Configuring CORS for production environments
- Managing environment variables securely
- Debugging production authentication and JWT configuration

The project provided practical experience in building and deploying a complete full-stack React application rather than only implementing isolated frontend components.

---

## Future Improvements

Possible future enhancements include:

- Real-time collaboration using Socket.IO
- Task comments
- Activity history
- Notifications
- Custom Kanban columns
- Task labels and tags
- File attachments
- Workspace-level collaboration
- Advanced user roles
- Email notifications
- Dark mode
- Additional analytics and charts

These features are outside the current core scope of the application.

---

## Author

**Harshita Bisht**

Full-Stack Developer

GitHub: Add your GitHub profile URL

Portfolio: Add your portfolio URL

---

## License

This project is intended for educational and portfolio purposes.
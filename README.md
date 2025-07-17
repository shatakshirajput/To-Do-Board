# 🚀 Real-Time Collaborative To-Do Board

A full-stack MERN application featuring a real-time collaborative To-Do board with drag-and-drop functionality, conflict resolution, and smart task assignment.

![To-Do Board](https://img.shields.io/badge/React-19.1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-orange)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7.4-purple)

## ✨ Features

### 🔐 Authentication
- **JWT-based authentication** with secure password hashing
- **User registration and login** with validation
- **Protected routes** with automatic redirect
- **Session persistence** across browser sessions

### 📋 Task Management
- **Full CRUD operations** for tasks
- **Smart task assignment** - automatically assigns to users with fewest active tasks
- **Priority levels** (Low, Medium, High) with visual indicators
- **Task validation** - unique titles and column name restrictions
- **Version control** for conflict detection

### 🎯 Real-Time Collaboration
- **Live updates** using Socket.IO
- **Real-time activity logging** - tracks last 20 user actions
- **Instant conflict detection** when multiple users edit simultaneously
- **Conflict resolution UI** - choose between merge or overwrite

### 🎨 User Interface
- **Custom Kanban board** with drag-and-drop functionality
- **Responsive design** - works seamlessly on desktop, tablet, and mobile
- **Modern UI** with smooth animations and hover effects
- **Activity log panel** with live updates
- **Custom animations** for enhanced user experience

### 🛡️ Advanced Features
- **Conflict handling** - detects and resolves concurrent edits
- **Smart assign logic** - balances workload across team members
- **Input validation** - client and server-side validation
- **Error handling** - comprehensive error management
- **Accessibility** - keyboard navigation and screen reader support

## 🏗️ Architecture

```
Directory structure:
└── shatakshirajput-to-do-board.git/
    ├── README.md
    ├── Logic_Document.md
    ├── Backend/
    │   ├── README.md
    │   ├── package.json
    │   ├── server.js
    │   ├── config/
    │   │   └── db.js
    │   ├── controllers/
    │   │   ├── actionController.js
    │   │   ├── authController.js
    │   │   ├── taskController.js
    │   │   └── userController.js
    │   ├── middlewares/
    │   │   └── authenticateToken.js
    │   ├── models/
    │   │   ├── ActionLog.js
    │   │   ├── Task.js
    │   │   └── User.js
    │   ├── routes/
    │   │   ├── actionRoutes.js
    │   │   ├── authRoutes.js
    │   │   ├── taskRoutes.js
    │   │   └── userRoutes.js
    │   ├── socket/
    │   │   └── index.js
    │   └── utils/
    │       └── logAction.js
    └── Frontend/
        ├── README.md
        ├── eslint.config.js
        ├── index.html
        ├── package.json
        ├── vercel.json
        ├── vite.config.js
        └── src/
            ├── App.css
            ├── App.jsx
            ├── index.css
            ├── main.jsx
            ├── components/
            │   ├── Footer.css
            │   ├── Footer.jsx
            │   ├── Home.css
            │   ├── Home.jsx
            │   ├── Navbar.css
            │   ├── Navbar.jsx
            │   ├── Auth/
            │   │   ├── Auth.css
            │   │   ├── LoginForm.jsx
            │   │   └── RegisterForm.jsx
            │   ├── Board/
            │   │   ├── ActivityLog.css
            │   │   ├── ActivityLog.jsx
            │   │   ├── KanbanBoard.css
            │   │   └── KanbanBoard.jsx
            │   └── Task/
            │       ├── ConflictModal.css
            │       ├── ConflictModal.jsx
            │       ├── DeleteConfirmModal.css
            │       ├── DeleteConfirmModal.jsx
            │       ├── TaskCard.css
            │       ├── TaskCard.jsx
            │       ├── TaskForm.css
            │       └── TaskForm.jsx
            ├── contexts/
            │   └── AuthContext.jsx
            └── services/
                ├── api.js
                └── socket.js

```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (v5.0 or higher)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd To-Do_Board
```

### 2. Backend Setup
```bash
cd Backend

# Install dependencies
npm install

# Create environment file
# Create a .env file with the following content:
MONGODB_URI=mongodb://localhost:27017/todo-board
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
FRONTEND_URL=http://localhost:5173

# Start MongoDB (make sure it's running)
# On Windows: Start MongoDB service
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# Start the server
npm run dev
```

### 3. Frontend Setup
```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Task Endpoints
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Action Logs
- `GET /api/actions` - Get last 20 action logs

### Users
- `GET /api/users` - Get all users

### Socket.IO Events
- `taskCreated` - Emitted when a task is created
- `taskUpdated` - Emitted when a task is updated
- `taskDeleted` - Emitted when a task is deleted

## 🎯 Smart Features Explained

### Smart Assign Logic
The system automatically assigns tasks to users with the fewest active tasks (Todo + In Progress) to ensure balanced workload distribution across team members.

### Conflict Resolution
When two users edit the same task simultaneously:
1. **Version detection** - compares local and server versions
2. **Conflict modal** - shows both versions with differences
3. **Resolution options**:
   - **Merge**: Combine changes manually
   - **Overwrite**: Use your version

### Real-Time Updates
- **Socket.IO integration** for instant updates
- **Live activity feed** showing user actions
- **Automatic UI updates** without page refresh

## 🎨 Custom Animations

- **Slide-up animations** for modals and forms
- **Hover effects** on task cards and buttons
- **Loading spinners** with smooth transitions
- **Drag-and-drop animations** with visual feedback
- **Fade-in effects** for new content

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🔧 Development

### Backend Development
```bash
cd Backend
npm run dev  # Development with nodemon
npm start    # Production mode
```

### Frontend Development
```bash
cd Frontend
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview production build
```

### Code Structure
- **Modular components** with clear separation of concerns
- **Custom hooks** for reusable logic
- **Context API** for state management
- **Service layer** for API communication
- **Comprehensive error handling**

## 🚀 Deployment

### Backend Deployment (Render)
```bash
Deploy the project on render with all the snv's stated 
```

### Frontend Deployment (Vercel/Netlify)
```bash
cd Frontend
npm run build
# Deploy the dist folder to your preferred platform
```

### Environment Variables
```env
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/todo-board
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
FRONTEND_URL=http://localhost:5173

# Frontend (update API_BASE_URL in services/api.js)
API_BASE_URL=https://your-backend-url.com/api
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Task creation, editing, and deletion
- [ ] Drag-and-drop functionality
- [ ] Real-time updates across multiple browsers
- [ ] Conflict resolution scenarios
- [ ] Responsive design on different screen sizes
- [ ] Activity log updates
- [ ] Smart assign functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- **React** for the amazing frontend framework
- **Express.js** for the robust backend
- **MongoDB** for the flexible database
- **Socket.IO** for real-time communication
- **@hello-pangea/dnd** for drag-and-drop functionality

---

**Built with ❤️ using the MERN stack** 

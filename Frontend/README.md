# To-Do Board Frontend

Real-time collaborative To-Do board frontend built with React, featuring drag-and-drop Kanban board and real-time updates.

## Features

- ✅ **Authentication** - Login/Register pages
- ✅ **Custom Kanban Board** with drag-and-drop functionality
- ✅ **Real-Time Updates** using Socket.IO
- ✅ **Activity Log Panel** with live updates
- ✅ **Custom Animations** for smooth user experience
- ✅ **Responsive Design** for mobile and desktop
- ✅ **Conflict Resolution** UI for concurrent edits
- ✅ **Smart Task Assignment** display

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Dependencies

- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router-dom** - Client-side routing
- **socket.io-client** - Real-time communication
- **axios** - HTTP client for API calls
- **react-beautiful-dnd** - Drag and drop functionality

## Project Structure

```
Directory structure:
└── shatakshirajput-to-do-board.git/
    ├── README.md
    ├── Logic_Document.md
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

## Key Components

- **KanbanBoard** - Main drag-and-drop board
- **TaskCard** - Individual task display
- **ActivityLog** - Real-time activity feed
- **AuthForm** - Login/Register forms
- **ConflictModal** - Conflict resolution UI

## Real-Time Features

- Live task updates across all connected users
- Real-time activity logging
- Instant conflict detection and resolution
- Collaborative task management

## Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## Custom Animations

- Smooth drag-and-drop transitions
- Task card hover effects
- Loading animations
- Success/error notifications

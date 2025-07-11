# To-Do Board Backend

Real-time collaborative To-Do board backend API built with Node.js, Express, MongoDB, and Socket.IO.

## Features

- ✅ **Authentication** with JWT and hashed passwords
- ✅ **Task Management** via REST API
- ✅ **Real-Time Updates** using Socket.IO
- ✅ **Action Logging** - stores last 20 user actions
- ✅ **Conflict Handling** for concurrent edits
- ✅ **Smart Assign** logic for task assignment
- ✅ **Task Validation** - unique titles and column name restrictions

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the backend directory with:
   ```
   MONGODB_URI=mongodb://localhost:27017/todo-board
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system.

4. **Run the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Actions
- `GET /api/actions` - Get last 20 action logs

### Users
- `GET /api/users` - Get all users

## Socket.IO Events

- `taskCreated` - Emitted when a task is created
- `taskUpdated` - Emitted when a task is updated
- `taskDeleted` - Emitted when a task is deleted

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **socket.io** - Real-time communication
- **express-validator** - Input validation

## Smart Assign Logic

The system automatically assigns tasks to users with the fewest active tasks (Todo + In Progress) to ensure balanced workload distribution.

## Conflict Handling

When two users edit the same task simultaneously, the system detects version conflicts and returns both versions, allowing users to choose between merge or overwrite. 
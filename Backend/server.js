// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { body, validationResult } from 'express-validator';


// // Load environment variables
// dotenv.config();


// const app = express();
// const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin:  process.env.FRONTEND_URL, // Vite dev server
//     methods: ["GET", "POST"]
//   }
// });


// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // MongoDB Schemas
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, default: '' },
//   assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   status: { 
//     type: String, 
//     enum: ['Todo', 'In Progress', 'Done'], 
//     default: 'Todo' 
//   },
//   priority: { 
//     type: String, 
//     enum: ['Low', 'Medium', 'High'], 
//     default: 'Medium' 
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
//   lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   version: { type: Number, default: 1 }
// });

// const actionLogSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   action: { type: String, required: true },
//   taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
//   details: { type: String },
//   timestamp: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);
// const Task = mongoose.model('Task', taskSchema);
// const ActionLog = mongoose.model('ActionLog', actionLogSchema);

// // JWT Middleware
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access token required' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid token' });
//     req.user = user;
//     next();
//   });
// };

// // Helper function to log actions
// const logAction = async (userId, action, taskId = null, details = '') => {
//   try {
//     const log = new ActionLog({
//       user: userId,
//       action,
//       taskId,
//       details
//     });
//     await log.save();
    
//     // Keep only last 20 actions
//     const logs = await ActionLog.find().sort({ timestamp: -1 }).limit(20);
//     if (logs.length > 20) {
//       await ActionLog.deleteMany({ _id: { $nin: logs.map(log => log._id) } });
//     }
//   } catch (error) {
//     console.error('Error logging action:', error);
//   }
// };

// // Smart Assign Logic - assigns task to user with fewest active tasks
// const getOptimalAssignee = async () => {
//   try {
//     const users = await User.find();
//     if (users.length === 0) return null;

//     const userTaskCounts = await Promise.all(
//       users.map(async (user) => {
//         const activeTaskCount = await Task.countDocuments({
//           assignedUser: user._id,
//           status: { $in: ['Todo', 'In Progress'] }
//         });
//         return { userId: user._id, count: activeTaskCount };
//       })
//     );

//     const optimalUser = userTaskCounts.reduce((min, current) => 
//       current.count < min.count ? current : min
//     );

//     return optimalUser.userId;
//   } catch (error) {
//     console.error('Error getting optimal assignee:', error);
//     return null;
//   }
// };

// // Routes

// // Register
// app.post('/api/auth/register', [
//   body('username').isLength({ min: 3 }).trim().escape(),
//   body('email').isEmail().normalizeEmail(),
//   body('password').isLength({ min: 6 })
// ], async (req, res) => {
//   console.log('Register attempt:', { username: req.body.username, email: req.body.email });
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { username, email, password } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ 
//       $or: [{ email }, { username }] 
//     });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create user
//     const user = new User({
//       username,
//       email,
//       password: hashedPassword
//     });

//     await user.save();
//     await logAction(user._id, 'User registered', null, `New user: ${username}`);

//     // Generate JWT
//     const token = jwt.sign(
//       { userId: user._id, username: user.username },
//     process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.status(201).json({
//       message: 'User created successfully',
//       token,
//       user: { id: user._id, username: user.username, email: user.email }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Login
// app.post('/api/auth/login', [
//   body('email').isEmail().normalizeEmail(),
//   body('password').exists()
// ], async (req, res) => {
//   console.log('Login attempt:', { email: req.body.email, hasPassword: !!req.body.password });
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;

//     // Find user
//     const user = await User.findOne({ email });
//     console.log('User lookup result:', user ? 'User found' : 'User not found');
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Check password
//     const isValidPassword = await bcrypt.compare(password, user.password);
//     console.log('Password validation:', isValidPassword ? 'Valid' : 'Invalid');
//     if (!isValidPassword) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     await logAction(user._id, 'User logged in', null, `Login: ${user.username}`);

//     // Generate JWT
//     const token = jwt.sign(
//       { userId: user._id, username: user.username },
//      process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({
//       message: 'Login successful',
//       token,
//       user: { id: user._id, username: user.username, email: user.email }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get all tasks
// app.get('/api/tasks', authenticateToken, async (req, res) => {
//   try {
//     const tasks = await Task.find().populate('assignedUser', 'username');
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get single task
// app.get('/api/tasks/:id', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const task = await Task.findById(id).populate('assignedUser', 'username');
    
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }
    
//     res.json(task);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Create task
// app.post('/api/tasks', [
//   authenticateToken,
//   body('title').isLength({ min: 1 }).trim().escape(),
//   body('description').optional().trim().escape(),
//   body('priority').isIn(['Low', 'Medium', 'High'])
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { title, description, priority } = req.body;

//     // Check if title is unique and doesn't match column names
//     const columnNames = ['Todo', 'In Progress', 'Done'];
//     if (columnNames.includes(title)) {
//       return res.status(400).json({ message: 'Task title cannot match column names' });
//     }

//     const existingTask = await Task.findOne({ title });
//     if (existingTask) {
//       return res.status(400).json({ message: 'Task title must be unique' });
//     }

//     // Smart assign
//     const assignedUser = await getOptimalAssignee();

//     const task = new Task({
//       title,
//       description,
//       priority,
//       assignedUser
//     });

//     await task.save();
//     await logAction(req.user.userId, 'Task created', task._id, `Created: ${title}`);

//     // Emit to all clients
//     io.emit('taskCreated', { task: await task.populate('assignedUser', 'username') });

//     res.status(201).json({ task: await task.populate('assignedUser', 'username') });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Update task
// app.put('/api/tasks/:id', [
//   authenticateToken,
//   body('title').optional().isLength({ min: 1 }).trim().escape(),
//   body('description').optional().trim().escape(),
//   body('status').optional().isIn(['Todo', 'In Progress', 'Done']),
//   body('priority').optional().isIn(['Low', 'Medium', 'High']),
//   body('assignedUser').optional().isMongoId()
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { id } = req.params;
//     const { title, description, status, priority, assignedUser, version } = req.body;

//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     // Conflict handling
//     if (version !== undefined && task.version !== version) {
//       console.log(`Conflict detected for task ${id}: client version ${version}, server version ${task.version}`);
//       return res.status(409).json({
//         message: 'Conflict detected',
//         currentVersion: task.version,
//         serverTask: task
//       });
//     }

//     // Update task
//     if (title) task.title = title;
//     if (description !== undefined) task.description = description;
//     if (status) task.status = status;
//     if (priority) task.priority = priority;
//     if (assignedUser !== undefined) {
//       if (assignedUser === '') {
//         // Smart assign
//         task.assignedUser = await getOptimalAssignee();
//       } else {
//         task.assignedUser = assignedUser;
//       }
//     }
    
//     task.updatedAt = new Date();
//     task.lastModifiedBy = req.user.userId;
//     task.version += 1;

//     await task.save();
//     await logAction(req.user.userId, 'Task updated', task._id, `Updated: ${task.title}`);

//     // Emit to all clients
//     io.emit('taskUpdated', { task: await task.populate('assignedUser', 'username') });

//     res.json({ task: await task.populate('assignedUser', 'username') });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Delete task
// app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const task = await Task.findByIdAndDelete(id);
    
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     await logAction(req.user.userId, 'Task deleted', id, `Deleted: ${task.title}`);

//     // Emit to all clients
//     io.emit('taskDeleted', { taskId: id });

//     res.json({ message: 'Task deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get action logs
// app.get('/api/actions', authenticateToken, async (req, res) => {
//   try {
//     const logs = await ActionLog.find()
//       .populate('user', 'username')
//       .populate('taskId', 'title')
//       .sort({ timestamp: -1 })
//       .limit(20);
    
//     res.json(logs);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get all users
// app.get('/api/users', authenticateToken, async (req, res) => {
//   try {
//     const users = await User.find({}, 'username email');
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Socket.IO connection handling
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// server.listen(process.env.PORT || 5000, () => {
//   console.log(`Server running on port ${process.env.PORT || 5000}`);
// });


import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import initSocket from './socket/index.js';
import actionRoutes from './routes/actionRoutes.js';

dotenv.config();
connectDB();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, methods: ['GET', 'POST'] }
});
initSocket(io);
app.set('io', io);
io.on('connection', socket => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});



app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api', actionRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

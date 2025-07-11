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
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
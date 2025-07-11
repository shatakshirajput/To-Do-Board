import express from 'express';
import { body } from 'express-validator';
import authenticateToken from '../middlewares/authenticateToken.js';
import {
  getAllTasks, getTaskById,
  createTask, updateTask, deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

// Attach socket.io instance
router.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

router.get('/', authenticateToken, getAllTasks);
router.get('/:id', authenticateToken, getTaskById);

router.post(
  '/',
  authenticateToken,
  body('title').notEmpty(),
  body('priority').isIn(['Low', 'Medium', 'High']),
  createTask
);

router.put(
  '/:id',
  authenticateToken,
  body('status').optional().isIn(['Todo', 'In Progress', 'Done']),
  updateTask
);

router.delete('/:id', authenticateToken, deleteTask);

export default router;

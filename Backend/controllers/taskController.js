import { validationResult } from 'express-validator';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { logAction } from '../utils/logAction.js';

async function getOptimalAssignee() {
  const users = await User.find();
  if (!users.length) return null;
  const counts = await Promise.all(users.map(async u => ({
    userId: u._id,
    count: await Task.countDocuments({ assignedUser: u._id, status: { $in: ['Todo', 'In Progress'] } })
  })));
  return counts.reduce((a, b) => (b.count < a.count ? b : a)).userId;
}

export const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, description, priority } = req.body;
  if (['Todo','In Progress','Done'].includes(title))
    return res.status(400).json({ message: 'Task title cannot match column names' });

  if (await Task.findOne({ title }))
    return res.status(400).json({ message: 'Task title must be unique' });

  const task = await Task.create({
    title, description, priority,
    assignedUser: await getOptimalAssignee()
  });

  await logAction(req.user.userId, 'Task created', task._id, `Created: ${title}`);

  const populated = await task.populate('assignedUser', 'username');
  req.io.emit('taskCreated', { task: populated });
  res.status(201).json({ task: populated });
};

export const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  const updates = req.body;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (updates.version !== undefined && updates.version !== task.version) {
    return res.status(409).json({
      message: 'Conflict detected',
      currentVersion: task.version,
      serverTask: task
    });
  }

  for (const field of ['title','description','status','priority','assignedUser']) {
  if (updates[field] !== undefined) {
    if (field === 'assignedUser' && updates[field] === '') {
      task.assignedUser = await getOptimalAssignee(); // ✅ now this works
    } else {
      task[field] = updates[field];
    }
  }
};

  task.updatedAt = new Date();
  task.lastModifiedBy = req.user.userId;
  task.version += 1;

  await task.save();
  await logAction(req.user.userId, 'Task updated', task._id, `Updated: ${task.title}`);

  const populated = await task.populate('assignedUser', 'username');
  req.io.emit('taskUpdated', { task: populated });
  res.json({ task: populated });
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  await logAction(req.user.userId, 'Task deleted', task._id, `Deleted: ${task.title}`);
  req.io.emit('taskDeleted', { taskId: id });
  res.json({ message: 'Task deleted successfully' });
};

export const getAllTasks = async (req, res) => {
  const tasks = await Task.find().populate('assignedUser', 'username');
  res.json(tasks);
};

export const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id).populate('assignedUser', 'username');
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

import ActionLog from '../models/ActionLog.js';

export const getAllLogs = async (req, res) => {
  try {
    const logs = await ActionLog.find()
      .populate('user', 'username')
      .populate('taskId', 'title')
      .sort({ timestamp: -1 })
      .limit(20);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

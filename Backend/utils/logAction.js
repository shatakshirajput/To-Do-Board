import ActionLog from '../models/ActionLog.js';

export const logAction = async (userId, action, taskId = null, details = '') => {
  try {
    const log = new ActionLog({ user: userId, action, taskId, details });
    await log.save();

    const logs = await ActionLog.find().sort({ timestamp: -1 }).limit(20);
    if (logs.length > 20) {
      await ActionLog.deleteMany({ _id: { $nin: logs.map(l => l._id) } });
    }
  } catch (err) {
    console.error('❌ Error logging action:', err.message);
  }
};

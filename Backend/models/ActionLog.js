import mongoose from 'mongoose';

const actionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('ActionLog', actionLogSchema);

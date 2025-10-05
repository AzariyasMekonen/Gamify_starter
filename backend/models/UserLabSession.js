import mongoose from 'mongoose';
const UserLabSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', index: true },
  tasksCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  xpEarned: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
  isComplete: { type: Boolean, default: false }
});
UserLabSessionSchema.index({ user:1, lab:1 }, { unique: true });
export default mongoose.model('UserLabSession', UserLabSessionSchema);

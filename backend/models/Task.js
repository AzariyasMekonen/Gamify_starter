import mongoose from 'mongoose';
const TaskSchema = new mongoose.Schema({
  description: String,
  answerHash: String,
  points: { type: Number, default: 10 },
  tags: [String]
});
export default mongoose.model('Task', TaskSchema);

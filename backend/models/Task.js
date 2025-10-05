import mongoose from 'mongoose';
const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: { type: String, enum: ['Easy','Medium','Hard'], default: 'Easy' },
  xp: { type: Number, default: 10 },
  answerKey: String
});
export default mongoose.model('Task', TaskSchema);

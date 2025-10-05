import mongoose from 'mongoose';
const LabSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  description: String,
  tags: [String],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Lab', LabSchema);

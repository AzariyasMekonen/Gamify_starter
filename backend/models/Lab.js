import mongoose from 'mongoose';
const LabSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  difficulty: { type:String, default:'Medium' },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Lab', LabSchema);

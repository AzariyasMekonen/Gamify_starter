import mongoose from 'mongoose';
const BadgeSchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String,
  xpReward: { type: Number, default: 0 }
});
export default mongoose.model('Badge', BadgeSchema);

import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  xp: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActive: { type: Date },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  createdAt: { type: Date, default: Date.now }
});
UserSchema.methods.updateLeague = function() {
  if (this.xp >= 2000) return 'Diamond';
  if (this.xp >= 1000) return 'Platinum';
  if (this.xp >= 600) return 'Gold';
  if (this.xp >= 300) return 'Silver';
  return 'Bronze';
};
export default mongoose.model('User', UserSchema);

import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  totalPoints: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActionDate: { type: Date },
  skills: { recon:{type:Number,default:0}, web:{type:Number,default:0}, pwn:{type:Number,default:0} },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('User', UserSchema);

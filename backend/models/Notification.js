import mongoose from 'mongoose';
const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  type: { type: String, enum: ['info','success','warning'], default: 'info' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Notification', NotificationSchema);

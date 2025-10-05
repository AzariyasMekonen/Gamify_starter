import Notification from '../models/Notification.js';

export async function getNotifications(req, res) {
  const userId = req.query.userId;
  const notifs = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(50);
  res.json(notifs);
}

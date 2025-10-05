import User from '../models/User.js';

export async function getLeaderboard(req, res) {
  const top = await User.find().sort({ xp: -1 }).limit(10).select('username xp currentStreak longestStreak');
  res.json(top);
}

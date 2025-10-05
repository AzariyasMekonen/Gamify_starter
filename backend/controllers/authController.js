import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export async function register(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'missing' });
  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) return res.status(400).json({ error: 'user exists' });
  const hash = await bcrypt.hash(password, 10);
  const u = new User({ username, email, passwordHash: hash });
  await u.save();
  res.json({ success: true, user: { id: u._id, username: u.username, xp: u.xp } });
}

export async function login(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'invalid' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'invalid' });
  res.json({ success: true, user: { id: user._id, username: user.username, xp: user.xp } });
}

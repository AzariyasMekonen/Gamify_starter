import express from 'express';
import User from '../models/User.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const top = await User.find().sort({ totalPoints: -1 }).limit(10).select('username totalPoints');
  res.json(top);
});

export default router;

import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
const router = express.Router();

router.post('/register', async (req,res)=>{
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const u = new User({ username, email, passwordHash: hash });
  await u.save();
  res.json({ success:true, userId: u._id });
});

router.get('/seed', async (req,res)=>{
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      await User.create([{ username:'h4x0r', email:'h4x0r@adwa.local', passwordHash:'x' , totalPoints:903435 },
                         { username:'rootuser', email:'root@adwa.local', passwordHash:'x', totalPoints:833645 },
                         { username:'1337n1njj4', email:'n@adwa.local', passwordHash:'x', totalPoints:789123 }]);
    }
    res.json({ seeded:true });
  } catch(e){ res.status(500).json({error:e.message}) }
});

export default router;

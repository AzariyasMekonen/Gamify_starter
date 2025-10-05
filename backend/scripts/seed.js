import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Lab from '../models/Lab.js';
import Badge from '../models/Badge.js';

dotenv.config();
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/adwa';

async function run(){
  await mongoose.connect(MONGO);
  console.log('connected');
  await User.deleteMany({}); await Task.deleteMany({}); await Lab.deleteMany({}); await Badge.deleteMany({});
  const u = await User.create({ username:'demo', email:'demo@local', passwordHash:'x', xp:120, currentStreak:2 });
  const t1 = await Task.create({ title:'Find the flag', description:'Basic challenge', xp:50, answerKey:'flag{demo}' });
  const t2 = await Task.create({ title:'Enumerate', description:'Another task', xp:30, answerKey:'enumerate' });
  const lab = await Lab.create({ title:'Intro Lab', slug:'intro-lab', description:'A first lab', tasks:[t1._id, t2._id] });
  const b1 = await Badge.create({ name:'Rookie', description:'First 100 XP', xpReward:100 });
  console.log('seeded', {u,t1,t2,lab,b1});
  process.exit(0);
}
run().catch(e=>{console.error(e); process.exit(1)})

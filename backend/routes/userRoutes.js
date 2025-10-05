import express from 'express';
import User from '../models/User.js';
const router = express.Router();
router.get('/:id', async (req,res)=>{ const u = await User.findById(req.params.id).select('-passwordHash'); if(!u) return res.status(404).json({error:'not found'}); res.json(u); });
export default router;

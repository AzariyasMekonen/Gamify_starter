import express from 'express';
import { getBadges } from '../controllers/badgeController.js';
const router = express.Router();
router.get('/', getBadges);
export default router;

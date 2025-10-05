import express from 'express';
import { getLabs, getLab, startLab, submitTask } from '../controllers/labController.js';
const router = express.Router();
router.get('/', getLabs);
router.get('/:id', getLab);
router.post('/:id/start', startLab);
router.post('/submit', submitTask);
export default router;

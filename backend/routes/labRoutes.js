import express from 'express';
import { submitTask } from '../controllers/labController.js';
const router = express.Router();

router.post('/submit', submitTask);

export default router;

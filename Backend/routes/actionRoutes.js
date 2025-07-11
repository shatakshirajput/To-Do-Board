import express from 'express';
import { getAllLogs } from '../controllers/actionController.js';
import  authenticateToken  from '../middlewares/authenticateToken.js';


const router = express.Router();

router.get('/actions', authenticateToken, getAllLogs);

export default router;

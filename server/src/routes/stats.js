import { Router } from 'express';
import { publicStats } from '../controllers/statsController.js';

const router = Router();
router.get('/', publicStats);

export default router;

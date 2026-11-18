import { Router } from 'express';
import authRoutes from './auth.js';
import donorRoutes from './donors.js';
import requestRoutes from './requests.js';
import responseRoutes from './responses.js';
import adminRoutes from './admin.js';
import statsRoutes from './stats.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/donors', donorRoutes);
router.use('/requests', requestRoutes);
router.use('/responses', responseRoutes);
router.use('/admin', adminRoutes);
router.use('/stats', statsRoutes);

export default router;

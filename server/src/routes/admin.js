import { Router } from 'express';
import {
  listUsers,
  listAllRequests,
  disableDonor,
  adminStats,
} from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireAdmin);
router.get('/stats', adminStats);
router.get('/users', listUsers);
router.get('/requests', listAllRequests);
router.patch('/donors/:id/disable', disableDonor);

export default router;

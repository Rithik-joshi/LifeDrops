import { Router } from 'express';
import {
  withdrawResponse,
  updateResponseStatus,
  myResponses,
} from '../controllers/responseController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/mine', requireAuth, myResponses);
router.patch('/:id', requireAuth, updateResponseStatus);
router.delete('/:id', requireAuth, withdrawResponse);

export default router;

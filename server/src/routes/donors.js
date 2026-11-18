import { Router } from 'express';
import {
  upsertMyDonorProfile,
  getMyDonorProfile,
  updateMyDonorProfile,
  searchDonors,
} from '../controllers/donorController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { upsertDonorSchema, updateDonorSchema, donorSearchSchema } from '../validators/donor.js';

const router = Router();

router.get('/', validate(donorSearchSchema, 'query'), searchDonors);
router.get('/me', requireAuth, getMyDonorProfile);
router.post('/', requireAuth, validate(upsertDonorSchema), upsertMyDonorProfile);
router.patch('/me', requireAuth, validate(updateDonorSchema), updateMyDonorProfile);

export default router;

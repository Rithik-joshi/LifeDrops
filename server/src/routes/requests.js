import { Router } from 'express';
import {
  listRequests,
  getRequest,
  createRequest,
  updateRequest,
  cancelRequest,
  fulfillRequest,
  myRequests,
} from '../controllers/requestController.js';
import {
  respondToRequest,
  listResponsesForRequest,
} from '../controllers/responseController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import {
  createRequestSchema,
  updateRequestSchema,
  listRequestsSchema,
  responseSchema,
} from '../validators/request.js';

const router = Router();

router.get('/', validate(listRequestsSchema, 'query'), listRequests);
router.get('/mine', requireAuth, myRequests);
router.get('/:id', optionalAuth, getRequest);
router.post('/', requireAuth, validate(createRequestSchema), createRequest);
router.patch('/:id', requireAuth, validate(updateRequestSchema), updateRequest);
router.post('/:id/cancel', requireAuth, cancelRequest);
router.post('/:id/fulfill', requireAuth, fulfillRequest);

router.post('/:id/responses', requireAuth, validate(responseSchema), respondToRequest);
router.get('/:id/responses', requireAuth, listResponsesForRequest);

export default router;

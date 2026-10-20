import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { ingest, heartbeat } from '../controllers/eventController.js';
import requireParticipant from '../middleware/requireParticipant.js';

const router = Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 200,
  keyGenerator: (req) => req.headers.authorization ?? 'anon',
});

router.post('/events', requireParticipant, limiter, ingest);
router.post('/heartbeat', requireParticipant, heartbeat);

export default router;
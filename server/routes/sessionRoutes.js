import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { start, end, active, join, live } from '../controllers/sessionController.js';
import { joinRules, validate } from '../validator/authValidator.js';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

const joinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: { message: 'Too many attempts. Try again later.' },
});

// Student (walang login)
router.post('/join', joinLimiter, joinRules, validate, join);

// Teacher (kailangan naka-login)
router.use(requireAuth);
router.post('/', start);
router.get('/active', active);
router.post('/:id/end', end);
router.get('/:id/live', live);

export default router;
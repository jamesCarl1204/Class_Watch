import Participant from '../models/participantModel.js';
import { hashToken } from '../utils/token.js';

export default async function requireParticipant(req, res, next) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer /, '');
    if (!token) return res.status(401).json({ message: 'Missing token' });

    const p = await Participant.findByTokenHash(hashToken(token));
    if (!p) return res.status(401).json({ message: 'Invalid token' });
    if (p.status !== 'active') return res.status(410).json({ message: 'Session ended' });

    req.participant = { id: p.id, sessionId: p.session_id };
    next();
  } catch (err) {
    console.error('requireParticipant error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
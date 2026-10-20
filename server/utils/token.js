import crypto from 'node:crypto';

export const newToken = () => crypto.randomBytes(32).toString('hex');
export const hashToken = (t) => crypto.createHash('sha256').update(t).digest('hex');
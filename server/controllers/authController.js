import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Teacher from '../models/Teacher.js';

const COOKIE_NAME = 'token';
const DUMMY_HASH = bcrypt.hashSync('dummy-password', 12);

const baseCookie = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

function sendToken(res, teacherId, remember) {
  const token = jwt.sign({ id: teacherId }, process.env.JWT_SECRET, {
    expiresIn: remember ? '7d' : '12h',
  });
  res.cookie(COOKIE_NAME, token, remember ? { ...baseCookie, maxAge: 7 * 24 * 3600 * 1000 } : baseCookie);
}

export async function register(req, res) {
  try {
    const { username, email, password } = req.body; 
    const passwordHash = await bcrypt.hash(password, 12);
    const teacher = await Teacher.create({ username, email, passwordHash });

    sendToken(res, teacher.id, false);
    res.status(201).json({ teacher });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'Email or username is already in use' });
    console.error('register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function login(req, res) {
  try {
    const { email, password, remember = false } = req.body;
    const teacher = await Teacher.findByEmail(email);

    const ok = await bcrypt.compare(password, teacher?.password_hash ?? DUMMY_HASH);
    if (!teacher || !ok)
      return res.status(401).json({ message: 'Invalid email or password' });

    sendToken(res, teacher.id, remember);
    res.json({ teacher: { id: teacher.id, username: teacher.username, email: teacher.email } });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export function logout(req, res) {
  res.clearCookie(COOKIE_NAME, baseCookie);
  res.json({ message: 'Logged out' });
}

export async function me(req, res) {
  try {
    const teacher = await Teacher.findById(req.teacherId);
    if (!teacher) return res.status(401).json({ message: 'Not authenticated' });
    res.json({ teacher });
  } catch (err) {
    console.error('me error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
import { body, validationResult } from 'express-validator';

export const registerRules = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be 3–50 characters'),
  body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Please enter a valid email')
    .isLength({ max: 255 })
    .withMessage('Email is too long'),
  body('password')
    .isLength({ min: 8, max: 72 })
    .withMessage('Password must be 8–72 characters'),
];

export const loginRules = [
  body('email').trim().toLowerCase().isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  body('remember').optional().toBoolean(),
];

export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array({ onlyFirstError: true });
  res.status(400).json({
    message: errors[0].msg,
    errors: Object.fromEntries(errors.map((e) => [e.path, e.msg])),
  });
}

export const joinRules = [
  body('code').trim().isLength({ min: 4, max: 12 }).withMessage('Invalid session code'),
  body('name').trim().isLength({ min: 1, max: 120 }).withMessage('Name is required'),
  body('studentId').trim().isLength({ min: 1, max: 50 }).withMessage('Student ID is required'),
];
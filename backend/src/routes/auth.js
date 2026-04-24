const express = require('express');
const { body, validationResult } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Inline validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

// POST /api/v1/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['user', 'admin']),
  validate,
], register);

// POST /api/v1/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
], login);

// GET /api/v1/auth/me
router.get('/me', protect, getMe);

module.exports = router;
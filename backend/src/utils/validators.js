import { body, validationResult } from 'express-validator';

/**
 * Validation rules for user registration
 */
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
];

/**
 * Validation rules for login
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Validation rules for updating try-on
 */
export const updateTryOnValidation = [
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),

  body('tags')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        const tags = value.split(',').map((t) => t.trim());
        if (tags.length > 10) {
          throw new Error('Maximum 10 tags allowed');
        }
        const validTags = tags.every((tag) => tag.length > 0 && tag.length <= 30);
        if (!validTags) {
          throw new Error('Each tag must be between 1 and 30 characters');
        }
        return true;
      }
      if (Array.isArray(value)) {
        if (value.length > 10) {
          throw new Error('Maximum 10 tags allowed');
        }
        const validTags = value.every(
          (tag) => typeof tag === 'string' && tag.length > 0 && tag.length <= 30
        );
        if (!validTags) {
          throw new Error('Each tag must be a string between 1 and 30 characters');
        }
        return true;
      }
      throw new Error('Tags must be a string or array');
    }),
];

/**
 * Middleware to check validation results
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  next();
};

export default {
  registerValidation,
  loginValidation,
  updateTryOnValidation,
  validate,
};
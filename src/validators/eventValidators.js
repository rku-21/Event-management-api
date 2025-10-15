const { body, param, validationResult } = require('express-validator');
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};


const createEventValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  
  body('date_time')
    .notEmpty()
    .withMessage('Date and time is required')
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (e.g., 2025-12-31T10:00:00Z)')
    .custom((value) => {
      const eventDate = new Date(value);
      const now = new Date();
      if (eventDate <= now) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Location must be between 2 and 255 characters'),
  
  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Capacity must be a positive integer between 1 and 1000'),
  
  validate,
];


const eventIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Event ID must be a positive integer'),
  
  validate,
];


const registerUserValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Event ID must be a positive integer'),
  
  body('user_id')
    .notEmpty()
    .withMessage('User ID is required')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  
  validate,
];


const cancelRegistrationValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Event ID must be a positive integer'),
  
  body('user_id')
    .notEmpty()
    .withMessage('User ID is required')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  
  validate,
];


const createUserValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  validate,
];

  
const userIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  
  validate,
];

module.exports = {
  createEventValidation,
  eventIdValidation,
  registerUserValidation,
  cancelRegistrationValidation,
  createUserValidation,
  userIdValidation,
};

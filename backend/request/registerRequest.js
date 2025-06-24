// validators/userValidator.js
const { body, validationResult } = require('express-validator');
const { sendValidationError } = require('../utils/helper');

// validators/userValidator.js
const createUserValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),
    
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
    
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    
  body('profile')
    .optional()
    .isString().withMessage('Profile must be a string'),
    
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .isMobilePhone('any').withMessage('Mobile number must be valid'),
    
  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['male', 'female', 'other']).withMessage('Invalid gender value'),
    
  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendValidationError(res, errors);
    }
    next();
  }
];
module.exports = {
  createUserValidator
};

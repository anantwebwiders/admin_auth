const { body, validationResult } = require('express-validator');
const { sendValidationError } = require('../utils/helper');

const orderRequest = [
  body('product_id')
    .notEmpty().withMessage('Product ID is required')
    .isInt().withMessage('Product ID must be an integer'),

  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),

  body('shipping_address')
    .notEmpty().withMessage('Shipping address is required')
    .isString().withMessage('Shipping address must be a string'),

  // Final middleware to check all validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendValidationError(res, errors);
    }
    next();
  }
];

module.exports = { orderRequest };

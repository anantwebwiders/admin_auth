const { body, validationResult } = require('express-validator');
const { sendValidationError } = require('../utils/helper');

const productRequest = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isString().withMessage('Product name must be a string'),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),

  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('sku')
    .notEmpty().withMessage('SKU is required')
    .isString().withMessage('SKU must be a string'),

  body('imageUrl')
    .optional(),

  body('categoryId')
    .notEmpty().withMessage('Category ID is required')
    .isInt().withMessage('Category ID must be an integer'),

  // Final middleware to check all validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendValidationError(res, errors);
    }
    next();
  }
];

module.exports = { productRequest };

const { body, validationResult } = require('express-validator');
const { sendValidationError } = require('../utils/helper');

const categorievalidate = [
      body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),

     (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendValidationError(res, errors);
    }
    next();
  }
];

module.exports = {categorievalidate};

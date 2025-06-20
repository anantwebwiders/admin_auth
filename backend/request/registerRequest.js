const { body, validationResult } = require('express-validator');

// Validation middleware
const createUserValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('profile').optional().isString().withMessage('Profile must be a string'),
    body('mobile').notEmpty().isMobilePhone().withMessage('Mobile number must be valid'),
    body('gender').notEmpty().withMessage('Gender is required'),
    // body('confirmPassword')
    //     .custom((value, { req }) => {
    //         if (value !== req.body.password) {
    //             throw new Error('Passwords do not match');
    //         }
    //         return true;
    //     }),

    // Error handling middleware
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors, message: 'Validation failed', status: 0, data : null });
        }
        next();
    }
];

module.exports = {
    createUserValidator
};

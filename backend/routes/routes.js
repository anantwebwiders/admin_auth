const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { sendSuccess } = require('../utils/helper');
const  { createUserValidator }  = require('../request/registerRequest');
const { resetPasswordValidator } = require('../request/resetPasswordRequest');
const { updateProfileValidator } = require('../request/updateProfileRequest');
const { registerUser, login  } = require('../controllers/authController');
const { uploadFile , updateProfile , forgetPassword, resetPassword} = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const auth = require('../middlewares/auth');

router.post('/register', upload.single('profile'), createUserValidator, registerUser);

router.post('/login', login);
router.post('/upload', upload.single('file'), uploadFile);
router.get('/dashboard', authMiddleware, (req, res) => {
  return sendSuccess(res, 'Welcome to dashboard', req.userData);
});
router.get('/Profile', authMiddleware, (req, res) => {
  return sendSuccess(res, 'Hello user', req.userData);
});
router.put('/update-profile', authMiddleware, updateProfileValidator ,updateProfile);
router.post('/forget-password', forgetPassword);
router.put('/reset-password', authMiddleware, resetPasswordValidator ,resetPassword);

module.exports = router;

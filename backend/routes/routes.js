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
const User = require('../repositories/userRepository');

router.post('/register', upload.single('profile'), createUserValidator, registerUser);

router.post('/login', login);
router.post('/upload', upload.single('file'), uploadFile);
router.get('/dashboard', authMiddleware, (req, res) => {
  return sendSuccess(res, 'Welcome to dashboard', req.userData);
});
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.userData.id;
    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, 'User not found', 'No record found');
    }
    const userData = user.toJSON ? user.toJSON() : user;
    delete userData.password;
    return sendSuccess(res, 'User fetched successfully', userData);
  } catch (error) {
    return sendError(res, 'Error fetching user', error.message);
  }
});
router.put('/update-profile', authMiddleware, upload.single('profile'), updateProfileValidator ,updateProfile);
router.post('/forget-password', forgetPassword);
router.put('/reset-password', authMiddleware, resetPasswordValidator ,resetPassword);

module.exports = router;

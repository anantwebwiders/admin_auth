const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const  { createUserValidator }  = require('../request/registerRequest');
const { registerUser, login  } = require('../controllers/authController');
const { uploadFile } = require('../controllers/userController');

router.post('/register', createUserValidator ,upload.single('profile') ,registerUser);
router.post('/login', login);
router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;

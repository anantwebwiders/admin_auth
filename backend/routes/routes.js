const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const  { createUserValidator }  = require('../request/registerRequest');
const { registerUser, login  } = require('../controllers/authController');

router.post('/register', upload.single('profile'), registerUser);
router.post('/login', login);

module.exports = router;

const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { sendSuccess } = require('../utils/helper');
const  { createUserValidator }  = require('../request/registerRequest');
const { resetPasswordValidator } = require('../request/resetPasswordRequest');
const { updateProfileValidator } = require('../request/updateProfileRequest');
const { registerUser, login, verifyEmail, resendVerificationLink  } = require('../controllers/authController');
const { uploadFile , updateProfile , forgetPassword, resetPassword} = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const allowRoles = require('../middlewares/roleMiddleware');
const auth = require('../middlewares/auth');
const User = require('../repositories/userRepository');
const {categorievalidate} = require('../request/categoryRequest');
const {productRequest} = require('../request/productRequest');
const {createCategory, getcategories, updateCategory, deleteCategory} = require('../controllers/categoryController');
const {createProduct, getProducts, updateProduct, deleteProduct, createOrder, getOrders, allOrders, createReview, getReviews} = require('../controllers/productController');
const {orderRequest} = require('../request/orderRequest');

router.post('/register', upload.single('profile'), createUserValidator, registerUser);

router.post('/login',login);
router.post('/upload', upload.single('file'), uploadFile);
router.get('/dashboard', authMiddleware,(req, res) => {
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
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verify-email', authMiddleware, resendVerificationLink);

// Categories
router.post('/categories/create', authMiddleware, categorievalidate, createCategory);
router.get('/categories', authMiddleware, getcategories);
router.put('/categories/:id', authMiddleware, categorievalidate, updateCategory);
router.delete('/categories/:id', authMiddleware, deleteCategory);

// products

router.post('/products', authMiddleware, productRequest, createProduct);
router.get('/products', authMiddleware, getProducts);
router.put('/products/:id', authMiddleware, productRequest, updateProduct);
router.delete('/products/:id', authMiddleware, deleteProduct);

// orders

router.post('/orders', authMiddleware, allowRoles('user'), orderRequest, createOrder)
router.get('/orders', authMiddleware, allowRoles('admin', 'seller'), allOrders)
router.get('/orders/user', authMiddleware, allowRoles('user'), getOrders)

// reviews
router.post('/reviews', authMiddleware, allowRoles('user'), createReview)
router.get('/reviews/:id', authMiddleware, getReviews)




module.exports = router;

const userService = require('../services/userService'); // service object (must export updateProfile)
const { storeFile } = require('../services/userService'); // individual function from same file
const { sendSuccess, sendError } = require('../utils/helper');

// ⬇️ Upload File Controller
const uploadFile = async (req, res) => {
  try {
    const uploadPath = req.body.path || 'uploads/default';

    if (!req.file) {
      return sendError(res, 'No file uploaded', 'File missing in request', 400);
    }

    const result = await storeFile(req.file, uploadPath);

    if (result.status !== 1) {
      return sendError(res, result.message, result.error, 400);
    }

    return sendSuccess(res, result.message, result.data);
  } catch (error) {
    console.error('Upload error:', error);
    return sendError(res, 'Something went wrong', error.message, 500);
  }
};

// ⬇️ Update Profile Controller
const updateProfile = async (req, res) => {
  try {
    const userId = req.userData?.id;

    if (!userId) {
      return sendError(res, 'Unauthorized', 'User ID not found in token', 401);
    }

    return await userService.updateProfile(res, userId, req.body);

    
  } catch (error) {
    console.error('Update Profile Error:', error);
    return sendError(res, 'Something went wrong', error.message, 500);
  }
};

const forgetPassword = async (req, res) => {
  try {
    if (!req.body.email) {
      return sendError(res, 'Email is required', 'Email missing in request', 400);
    }
    return await userService.forgetPassword(req.body, res);
  } catch (error) {
    console.error('Forget Password Error:', error);
    return sendError(res, 'Something went wrong', error.message, 500);
  }
}

const resetPassword = async (req, res) => {
  try {
     const userId = req.userData?.id;

    if (!userId) {
      return sendError(res, 'Unauthorized', 'User ID not found in token', 401);
    }

    return await userService.resetPassword(res, userId, req.body);
    
  } catch (error) {
    console.error('Reset Password Error:', error);
    return sendError(res, 'Something went wrong', error.message, 500);
  }
}

module.exports = {
  uploadFile,
  updateProfile,
  forgetPassword,
  resetPassword
};

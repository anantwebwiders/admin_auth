const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/helper');

exports.registerUser = async (req, res) => {
  try {
    return await authService.register(req.body, req.file, res); 

  } catch (error) {
    console.error('Register Error:', error);
    return sendError(res, 'Internal Server Error', error.message, 500);
  }
};

exports.login = async (req, res) => {
  try {
     return await authService.loginUser(req.body, res); 
  } catch (error) {
    console.error('Login Error:', error);
    return sendError(res, 'Internal Server Error', process.env.NODE_ENV === 'development' ? error.message : undefined, 500);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    return await authService.verifyEmail(req.params.token, res); 
  } catch (error) {
    console.error('Verify Email Error:', error);
    return sendError(res, 'Internal Server Error', process.env.NODE_ENV === 'development' ? error.message : undefined, 500);
  }
};

exports.resendVerificationLink = async (req, res) => {
  try {
    return await authService.resendVerificationLink(req.userData, res); 
  } catch (error) {
    console.error('Resend Verification Link Error:', error);
    return sendError(res, 'Internal Server Error', process.env.NODE_ENV === 'development' ? error.message : undefined, 500);
  }
};
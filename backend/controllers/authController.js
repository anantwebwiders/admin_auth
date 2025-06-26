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
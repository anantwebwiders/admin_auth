const authService = require('../services/authService');

exports.registerUser = async (req, res) => {
  try {
    
    const result = await authService.register(req.body, req.file);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

  
    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message, status: 0 , data: null });
  }
};

exports.login = async (req, res) => {
  try{
    const result = await authService.loginUser(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    return res.status(200).json({ message: result.message, user: result.user });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

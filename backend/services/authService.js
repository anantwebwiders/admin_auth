const { ExpressValidator } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/userRepository');
const { sendSuccess, sendError } = require('../utils/helper');

exports.register = async (userData, file, res) => {
  try {
    const { name, email, mobile, gender, password, confirmPassword } = userData;

    if (!name) return sendError(res, 'Name is required', null, 400);
    if (!email) return sendError(res, 'Email is required', null, 400);
    if (!password) return sendError(res, 'Password is required', null, 400);
    if (password !== confirmPassword) return sendError(res, 'Passwords do not match', null, 400);

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return sendError(res, 'Email already exists', 'Duplicate Email', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserRepository.create({
      name,
      email,
      mobile: mobile || null,
      gender: gender || null,
      password: hashedPassword,
      profile: file ? file.filename : null
    });

    return sendSuccess(res, 'User registered successfully', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      profile: newUser.profile
    });

  } catch (error) {
    console.error('Register Service Error:', error);
    return sendError(res, 'Registration failed', error.message, 500);
  }
};


exports.loginUser = async (userData, res) => {
  try {
    const { email, password } = userData;

    if (!email) return sendError(res, 'Email is required', null, 400);
    if (!password) return sendError(res, 'Password is required', null, 400);

    const user = await UserRepository.findByEmail(email);
    if (!user) return sendError(res, 'Invalid email or password', null, 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendError(res, 'Invalid email or password', null, 401);

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const userDataToReturn = {
      id: user.id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      token
    };

    return sendSuccess(res, 'Login successful', userDataToReturn);

  } catch (error) {
    console.error('Login Service Error:', error);
    return sendError(res, 'Login failed', error.message, 500);
  }
};

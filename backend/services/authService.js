const { ExpressValidator } = require('express-validator');
const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const UserRepository = require('../repositories/UserRepository');

exports.register = async (userData, file) => {
  try {
    const { name, email, mobile, gender, password, confirmPassword } = userData;

    // ✅ Validate Fields (can also be handled with express-validator)
    if (!name) return { success: false, message: 'Name is required' };
    if (!email) return { success: false, message: 'Email is required' };
    if (!mobile) return { success: false, message: 'Mobile number is required' };
    if (!gender) return { success: false, message: 'Gender is required' };
    if (!password) return { success: false, message: 'Password is required' };
    if (password !== confirmPassword) return { success: false, message: 'Passwords do not match' };

    // ✅ Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return { success: false, message: 'Email already exists' };
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Prepare user object
    const userPayload = {
      name,
      email,
      mobile,
      gender,
      password: hashedPassword,
      profile: file ? file.filename : null // Assuming multer is used and `filename` is available
    };

    // ✅ Save user via BaseRepository
    const newUser = await UserRepository.create(userPayload);

    return { success: true, message: 'User registered successfully', data: newUser };

  } catch (error) {
    console.error('Registration Error:', error);
    return { success: false, message: 'Something went wrong', error };
  }
};



exports.loginUser = async (userData) => {
  const { email, password } = userData;

  if (!email) return { success: false, message: 'Email is required' };
  if (!password) return { success: false, message: 'Password is required' };

  return new Promise((resolve, reject) => {
    UserModel.getUserByEmail(email, (err, user) => {
      if (err) return reject(err);
      if (!user) return resolve({ success: false, message: 'Invalid email or password' });

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return reject(err);
        if (!isMatch) return resolve({ success: false, message: 'Invalid email or password' });

        resolve({ success: true, message: 'Login successful', user });
      });
    });
  });
};
// services/userService.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const UserRepository = require('../repositories/userRepository'); // Assuming you have a UserRepository for database operations
const { sendSuccess, sendError, sendMail } = require('../utils/helper');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const storeFile = async (file, uploadDir = 'uploads') => {
  try {
    if (!file) {
      return {
        status: 0,
        message: 'No file provided',
        error: 'File not found in request',
        data: null
      };
    }

    // ✅ 1. Make sure the directory exists (create if not)
    const uploadPath = path.join(__dirname, '..', uploadDir);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // ✅ 2. Generate a unique filename
    const ext = path.extname(file.originalname);
    const randomName = crypto.randomBytes(8).toString('hex') + '-' + Date.now() + ext;

    const fullPath = path.join(uploadPath, randomName);

    // ✅ 3. Move the file
    fs.writeFileSync(fullPath, file.buffer); // multer must be configured with `storage: multer.memoryStorage()`

    // ✅ 4. Return full path (or relative)
    return {
      status: 1,
      message: 'File uploaded successfully',
      error: null,
      data: {
        filename: randomName,
        fullPath: fullPath,
        relativePath: path.join(uploadDir, randomName)
      }
    };

  } catch (error) {
    console.error('File Upload Error:', error);
    return {
      status: 0,
      message: 'File upload failed',
      error: error.message,
      data: null
    };
  }
};

const updateProfile = async (res, userId, profileData) => {
  try {
    if (!userId) {
      return sendError(res, 'Unauthorized', 'User ID missing in token', 401);
    }

    if (!profileData || Object.keys(profileData).length === 0) {
      return sendError(res, 'Profile data is required', null, 400);
    }

    const isUpdated = await UserRepository.updateProfile(userId, profileData);
    if (!isUpdated) {
      return sendError(res, 'Profile not found or not updated', null, 400);
    }

    const updatedUser = await UserRepository.findById(userId, {
      attributes: { exclude: ['password'] }
    });

    return sendSuccess(res, 'Profile updated successfully', updatedUser);
  } catch (error) {
    console.error('Profile update service error:', error);
    return sendError(res, 'Something went wrong', error.message, 500);
  }
};


const generateRandomPassword = (length = 8) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const forgetPassword = async (data, res) => {
  try {
    if (!data.email) {
      return sendError(res, 'Email is required', 'Email missing in request', 400);
    }

    const user = await UserRepository.findByEmail(data.email);
    if (!user) {
      return sendError(res, 'User not found', 'No user found with this email', 404);
    }

    const newPlainPassword = generateRandomPassword(10);
    const hashedPassword = await bcrypt.hash(newPlainPassword, 10);

    const isUpdated = await UserRepository.update(user.id, { password: hashedPassword });

    if (!isUpdated) {
      return sendError(res, 'Failed to update password', 'Password update failed', 500);
    }

    // ✅ Call helper to send mail
    const emailResult = await sendMail({
      to: user.email,
      subject: "Your New Password",
      html: `<p>Hello ${user.name || 'User'},</p>
             <p>Your new password is: <strong>${newPlainPassword}</strong></p>
             <p>Please login and change it immediately.</p>
             <p>Regards,<br/>TrueFirms Team</p>`
    });

    if (emailResult.status === 0) {
  return sendError(res, emailResult.message, emailResult.error);
}

return sendSuccess(res, 'Password sent to email', { email: user.email });

  } catch (error) {
    console.error('Forget Password Error:', error);
    return sendError(res, 'Something went wrong', error.message, 500);
  }
};


const resetPassword = async (res, userId, data) => {
  try {
    if (!userId) {
      return sendError(res, 'Unauthorized', 'User ID missing in token', 401);
    }

    const { oldPassword, newPassword, confirmPassword } = data;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return sendError(res, 'All fields are required', 'Missing required fields', 400);
    }

    if (newPassword !== confirmPassword) {
      return sendError(res, 'Passwords do not match', 'New and confirm password mismatch', 400);
    }

    // Get current user from DB (with password)
    const user = await UserRepository.findById(userId, {
      attributes: ['id', 'password'] // make sure password is included
    });

    if (!user) {
      return sendError(res, 'User not found', null, 404);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return sendError(res, 'Old password is incorrect', null, 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const isUpdated = await UserRepository.update(userId, { password: hashedPassword });

    if (!isUpdated) {
      return sendError(res, 'Password update failed', null, 500);
    }

    return sendSuccess(res, 'Password updated successfully');
  } catch (error) {
    console.error('Password update service error:', error);
    return sendError(res, 'Something went wrong', error.message, 500);
  }
};

module.exports = {
  storeFile,
  updateProfile,
  forgetPassword,
  resetPassword
};

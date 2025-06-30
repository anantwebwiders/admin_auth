const { ExpressValidator } = require('express-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/userRepository');
const { sendSuccess, sendError, sendMail } = require('../utils/helper');
require('dotenv').config();

exports.register = async (userData, file, res) => {
  try {
    const { name, email, mobile, gender, password, confirmPassword, profile } = userData;

    // Validations...
    if (!name || !email || !password || !confirmPassword)
      return sendError(res, 'Missing required fields', null, 400);
    if (password !== confirmPassword)
      return sendError(res, 'Passwords do not match', null, 400);

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) return sendError(res, 'Email already exists', null, 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await UserRepository.create({
      name,
      email,
      mobile: mobile || null,
      gender: gender || null,
      password: hashedPassword,
      profile: profile || null,
      email_verified: false,
      verification_token: verificationToken
    });

    // Compose verification link
    // const verificationLink = `http://localhost:3000/verify-email/${verificationToken}`;
    const verificationLink = `http://3.110.221.225/verify-email/${verificationToken}`;

    // Send email with button
    await sendMail({
      to: email,
      subject: 'Verify Your Email',
      html: `
                <html>
                  <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Verification</title>
              <style>
                  /* Simplified CSS */
                  body, table, td {
                      -webkit-text-size-adjust: 100%;
                      -ms-text-size-adjust: 100%;
                      margin: 0;
                      padding: 0;
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      background-color: #f7f9fc;
                      color: #333;
                  }
                  
                  table {
                      border-collapse: collapse;
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                  }
                  
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                  }
                  
                  .card {
                      background: white;
                      border-radius: 12px;
                      overflow: hidden;
                      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                  }
                  
                  .header {
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      padding: 40px 0;
                      text-align: center;
                  }
                  
                  .title {
                      font-size: 28px;
                      font-weight: 600;
                      color: white;
                      margin: 0;
                      padding: 0 20px;
                  }
                  
                  .content {
                      padding: 40px;
                  }
                  
                  .text {
                      font-size: 16px;
                      line-height: 1.6;
                      color: #4a5568;
                      text-align: center;
                      margin: 0 0 30px;
                  }
                  
                  .button-container {
                      text-align: center;
                      margin: 30px 0;
                  }
                  
                  .button {
                      display: inline-block;
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white;
                      text-decoration: none;
                      font-size: 18px;
                      font-weight: 600;
                      padding: 16px 45px;
                      border-radius: 50px;
                      box-shadow: 0 4px 15px rgba(118, 75, 162, 0.3);
                      transition: all 0.3s ease-in;
                  }
                  
                  .button:hover{
                      transform: translateY(-3px);
                      transition: all 0.3s ease-out;
                  }
                  
                  .divider {
                      height: 1px;
                      background: #e2e8f0;
                      margin: 30px 0;
                  }
                  
                  .footer {
                      font-size: 14px;
                      color: #718096;
                      text-align: center;
                      padding: 0 20px 30px;
                  }
                  
                  /* Responsive styles */
                  @media screen and (max-width: 600px) {
                      .content {
                          padding: 30px 20px;
                      }
                      
                      .title {
                          font-size: 24px;
                      }
                      
                      .button {
                          padding: 14px 35px;
                          font-size: 16px;
                      }
                  }
              </style>
          </head>
          <body>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                      <td align="center">
                          <div class="container">
                              <table class="card" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <!-- Header -->
                                  <tr>
                                      <td class="header">
                                          <h1 class="title">Verify Your Email Address</h1>
                                      </td>
                                  </tr>
                                  
                                  <!-- Content -->
                                  <tr>
                                      <td class="content">
                                          <p class="text">Thank you for signing up. To complete your registration, please verify your email address by clicking the button below:</p>
                                          
                                          <div class="button-container">
                                              <a href="${verificationLink}" class="button">Verify Email Address</a>
                                          </div>
                                          
                                          <div class="divider"></div>
                                          
                                          <p class="text">If you did not create an account with us, you can safely ignore this email. This verification link will expire in 24 hours.</p>
                                          
                                          <p class="footer">© 2023 YourApp. All rights reserved.</p>
                                      </td>
                                  </tr>
                              </table>
                          </div>
                      </td>
                  </tr>
              </table>
          </body>
          </html>
                `
    });

    return sendSuccess(res, 'User registered. Please verify your email.', {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      mobile: newUser.mobile,
      gender: newUser.gender,
      email_verified: newUser.email_verified
    });

  } catch (error) {
    console.error('Register Error:', error);
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
      mobile: user.mobile,
      gender: user.gender,
      email_verified: user.email_verified,
      token
    };

    return sendSuccess(res, 'Login successful', userDataToReturn);

  } catch (error) {
    console.error('Login Service Error:', error);
    return sendError(res, 'Login failed', error.message, 500);
  }
};

exports.verifyEmail = async (token, res) => {
  try {
    const user = await UserRepository.findBytoken(token);

    if (!user) {
      return sendError(res, 'Invalid or expired link.', null, 404);
    }
    console.log(user.email_verified);
    if (user.email_verified == true) {
      return sendError(res, 'Link already used or expired.', null, 400);
    }else{
     const isUpdated = await UserRepository.update(user.id, { email_verified: true });
    if (!isUpdated) {
      return sendError(res, 'Email verification failed', null, 500);
    }

    return sendSuccess(res, 'Email verified successfully', null);
    }

  

  
  } catch (error) {
    console.error('Email Verification Service Error:', error);
    return sendError(res, 'Email verification failed', error.message, 500);
  }
};

exports.resendVerificationLink = async (userData, res) => {
  try {
    const user = await UserRepository.findByEmail(userData.email);
    if (!user) {
      return sendError(res, 'User not found', null, 404);
    }

    if (user.email_verified) {
      return sendError(res, 'Email already verified', null, 400);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // const verificationLink = `http://localhost:3000/verify-email/${verificationToken}`;
    const verificationLink = `http://3.110.221.225/verify-email/${verificationToken}`;

    
        await UserRepository.update(user.id, {
        verification_token: verificationToken,
        token: token
        });

    await sendMail({
      to: user.email,
      subject: "Verify Your Email Address",
      html:  `
                <html>
                  <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Verification</title>
              <style>
                  /* Simplified CSS */
                  body, table, td {
                      -webkit-text-size-adjust: 100%;
                      -ms-text-size-adjust: 100%;
                      margin: 0;
                      padding: 0;
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      background-color: #f7f9fc;
                      color: #333;
                  }
                  
                  table {
                      border-collapse: collapse;
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                  }
                  
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                  }
                  
                  .card {
                      background: white;
                      border-radius: 12px;
                      overflow: hidden;
                      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                  }
                  
                  .header {
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      padding: 40px 0;
                      text-align: center;
                  }
                  
                  .title {
                      font-size: 28px;
                      font-weight: 600;
                      color: white;
                      margin: 0;
                      padding: 0 20px;
                  }
                  
                  .content {
                      padding: 40px;
                  }
                  
                  .text {
                      font-size: 16px;
                      line-height: 1.6;
                      color: #4a5568;
                      text-align: center;
                      margin: 0 0 30px;
                  }
                  
                  .button-container {
                      text-align: center;
                      margin: 30px 0;
                  }
                  
                  .button {
                      display: inline-block;
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white;
                      text-decoration: none;
                      font-size: 18px;
                      font-weight: 600;
                      padding: 16px 45px;
                      border-radius: 50px;
                      box-shadow: 0 4px 15px rgba(118, 75, 162, 0.3);
                      transition: all 0.3s ease-in;
                  }
                  
                  .button:hover{
                      transform: translateY(-3px);
                      transition: all 0.3s ease-out;
                  }
                  
                  .divider {
                      height: 1px;
                      background: #e2e8f0;
                      margin: 30px 0;
                  }
                  
                  .footer {
                      font-size: 14px;
                      color: #718096;
                      text-align: center;
                      padding: 0 20px 30px;
                  }
                  
                  /* Responsive styles */
                  @media screen and (max-width: 600px) {
                      .content {
                          padding: 30px 20px;
                      }
                      
                      .title {
                          font-size: 24px;
                      }
                      
                      .button {
                          padding: 14px 35px;
                          font-size: 16px;
                      }
                  }
              </style>
          </head>
          <body>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                      <td align="center">
                          <div class="container">
                              <table class="card" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <!-- Header -->
                                  <tr>
                                      <td class="header">
                                          <h1 class="title">Verify Your Email Address</h1>
                                      </td>
                                  </tr>
                                  
                                  <!-- Content -->
                                  <tr>
                                      <td class="content">
                                          <p class="text">Thank you for signing up. To complete your registration, please verify your email address by clicking the button below:</p>
                                          
                                          <div class="button-container">
                                              <a href="${verificationLink}" class="button">Verify Email Address</a>
                                          </div>
                                          
                                          <div class="divider"></div>
                                          
                                          <p class="text">If you did not create an account with us, you can safely ignore this email. This verification link will expire in 24 hours.</p>
                                          
                                          <p class="footer">© 2023 YourApp. All rights reserved.</p>
                                      </td>
                                  </tr>
                              </table>
                          </div>
                      </td>
                  </tr>
              </table>
          </body>
          </html>
                `
    });

    return sendSuccess(res, 'Verification email sent to your registered email address.', {
      id: user.id,
      name: user.name,      
      email_verified: user.email_verified
    });

  } catch (error) {
    console.error('Error in sending verification email:', error);
    return sendError(res, 'Internal Server Error', error.message, 500);
  }
};
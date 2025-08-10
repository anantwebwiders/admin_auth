require('dotenv').config();
const nodemailer = require('nodemailer');

exports.sendSuccess = (res, message = "Success", data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    status: 1,
    message,
    data,
    error: null,

  });
};

exports.sendError = (res, message = "Something went wrong", error = null, statusCode = 500) => {
  return res.status(statusCode).json({
    status: 0,
    message,
    error,
    data: null,
  });
};

exports.sendValidationError = (res, errors, message = "Validation failed", statusCode = 422) => {
  const formattedErrors = errors.array().map(err => ({
    field: err.path,  // Changed from err.param to err.path
    message: err.msg,
  }));

  return res.status(statusCode).json({
    status: 0,
    message,
    error: formattedErrors,
    data: null,
  });
};

exports.sendMail = async ({ to, subject, html, res }) => {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      }
    });

    const fromEmail = `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`;

    await transport.sendMail({
      from: fromEmail,
      to,
      subject,
      html
    });

    if (res) {
      return exports.sendSuccess(res, 'Email sent successfully', { to });
    }

    return { status: 1, message: 'Email sent successfully', data: { to } };
  } catch (error) {
    console.error('Email sending error:', error);

    if (res) {
      return exports.sendError(res, 'Email sending failed', error.message, 500);
    }

    return { status: 0, message: 'Email sending failed', error: error.message, data: null };
  }
  
};
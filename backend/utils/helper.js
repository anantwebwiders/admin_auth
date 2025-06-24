exports.sendSuccess = (res, message = "Success", data = data, statusCode = 200) => {
  return res.status(statusCode).json({
    status: 1,
    message,
    error: null,
    data,
  });
};

exports.sendError = (res, message = "Something went wrong", error = error, statusCode = 500) => {
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
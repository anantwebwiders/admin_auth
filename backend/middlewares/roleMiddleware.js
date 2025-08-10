// middlewares/roleMiddleware.js

module.exports = function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    try {
      const user = req.userData; // userData should be set by authMiddleware
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({
          status: 0,
          message: 'Access denied: insufficient permissions',
          error: null,
          data: null,
        });
      }
      next();
    } catch (err) {
      return res.status(500).json({
        status: 0,
        message: 'Internal server error in role check',
        error: err.message,
        data: null,
      });
    }
  };
};

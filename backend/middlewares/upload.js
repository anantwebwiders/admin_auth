const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage with dynamic path and unique filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get path from request body or query
    const uploadPath = req.body.path || req.query.path || 'uploads';
    const fullPath = path.join(__dirname, '../', uploadPath);
    
    // Create directory if it doesn't exist
    fs.mkdirSync(fullPath, { recursive: true });
    
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to accept only certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
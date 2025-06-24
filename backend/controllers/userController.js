const userService = require('../services/userService');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        status: 0,
        message: 'No file uploaded',
        data: null
      });
    }

    // Get path from request (body or query)
    const customPath = req.body.path || req.query.path || 'uploads';
    
    // Store file using service
    const fileInfo = await userService.storeFile(req.file, customPath);

    return res.status(200).json({
      status: 1,
      message: 'File uploaded successfully',
      data: {
        filename: fileInfo.filename,
        originalname: fileInfo.originalname,
        path: fileInfo.path,
        size: fileInfo.size,
        mimetype: fileInfo.mimetype,
        url: `/uploads/${fileInfo.path}/${fileInfo.filename}` // Example URL
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ 
      status: 0,
      message: error.message || 'File upload failed',
      data: null
    });
  }
};

module.exports = {
  uploadFile
};
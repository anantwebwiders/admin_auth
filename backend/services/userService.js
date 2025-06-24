const fs = require('fs');
const path = require('path');

module.exports = {
  /**
   * Stores file with dynamic path
   * @param {Object} file - Multer file object
   * @param {String} customPath - Custom path from request
   * @returns {Promise<Object>} - File information
   */
  storeFile: async (file, customPath = 'uploads') => {
    try {
      const uploadPath = path.join(__dirname, '../', customPath);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const filename = file.fieldname + '-' + uniqueSuffix + ext;
      const filePath = path.join(uploadPath, filename);

      // Write file to disk
      await fs.promises.writeFile(filePath, file.buffer);

      return {
        originalname: file.originalname,
        filename,
        path: customPath,
        size: file.size,
        mimetype: file.mimetype,
        fullPath: filePath
      };
    } catch (error) {
      console.error('File storage error:', error);
      throw error;
    }
  }
};
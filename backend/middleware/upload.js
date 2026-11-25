const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp + original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

// File filter - allow all common image formats
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(jpe?g|png|gif|webp|bmp|heic|heif|svg|avif|tiff?)$/i;
  const isImageMime = file.mimetype.startsWith('image/') || allowedExtensions.test(file.originalname);

  if (isImageMime) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPG, PNG, WebP, GIF, BMP, HEIC, AVIF, SVG)'));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;

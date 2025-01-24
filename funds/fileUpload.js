// fileUpload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, path.join(__dirname, '../../MerchantGUI/uploads'));
    cb(null, path.join(__dirname, '/var/www/html/MerchantCDI/uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadFile = (req, res) => {
  if (req.file) {
    res.json({ success: true, message: 'File uploaded successfully!' });
  } else {
    res.status(400).json({ success: false, message: 'File upload failed.' });
  }
};

module.exports = {
  upload,
  uploadFile
};

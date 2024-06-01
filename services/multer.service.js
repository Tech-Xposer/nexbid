// upload.js
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const userId = req.user.id; 
    const extension = file.originalname.split('.').pop(); 
    const filename = `${userId}_${Date.now()}.${extension}`; 
    cb(null, filename);
  },
});

export const upload = multer({ storage: storage });

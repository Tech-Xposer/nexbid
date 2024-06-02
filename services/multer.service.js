// upload.js
import multer from "multer";
import fs from "fs";
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const path = `./public/uploads/${req.user.id}`;
		fs.mkdirSync(path, { recursive: true });
		cb(null, path);
	},
	filename: function (req, file, cb) {
		const userId = req.user.id;
		const extension = file.originalname.split(".").pop();
		const filename = `${userId}_${Date.now()}.${extension}`;
		cb(null, filename);
	},
});

export const upload = multer({ storage: storage });

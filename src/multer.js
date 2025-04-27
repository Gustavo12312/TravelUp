const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, './uploads')); // Path for saving uploaded files
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);  // Get file extension
        const filename = Date.now() + ext;  // Generate unique filename
        cb(null, filename);  // Final filename
    }
});

const upload = multer({ storage: storage }).single('photo'); // Set up multer with storage configuration

module.exports = upload;
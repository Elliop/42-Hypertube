const uniqid = require('uniqid');
const multer = require('multer');
const uploadDir = "uploads/pictures";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, `${uniqid()}.${file.mimetype.split('/').pop()}`);
    }
});

const upload = multer({ storage: storage });

module.exports = {
    uploadDir,
    upload
};
const express = require('express');
const { upload, uploadFile } = require('../controller/uploadController');
const { protect, admin, creator } = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/upload', upload.single('file'), uploadFile, protect, admin, creator);

module.exports = router;

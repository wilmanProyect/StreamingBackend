const express = require('express');
const { upload, uploadFile } = require('../controller/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/upload', upload.single('file'), protect, admin, uploadFile);

module.exports = router;

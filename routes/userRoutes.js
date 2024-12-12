const express = require('express');
const {registerUser, loginUser, subscribeUser, getUserProfile} = require('../controller/userController');
const { protect} = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', protect, getUserProfile);

router.post('/register',registerUser);
router.post('/login',loginUser);

router.post('/subscribe', protect, subscribeUser);

module.exports = router;
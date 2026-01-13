const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUser, 
  getUserProfile, 
  getLeaderboard,
  updateUserProfile
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// User Profile & Stats
router.get('/me', protect, getUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Public Leaderboard
router.get('/leaderboard', getLeaderboard);

module.exports = router;
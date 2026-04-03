const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
  createContest,
  getContests,
  getContest,
  joinContest,
  joinByCode,
  contestSubmit,
  getContestLeaderboard,
  deleteContest,
} = require('../controllers/contestController');

// Public-ish (protected = logged in)
router.get('/', protect, getContests);
router.get('/:id', protect, getContest);
router.post('/:id/join', protect, joinContest);
router.post('/join-code', protect, joinByCode);
router.post('/:id/submit', protect, contestSubmit);
router.get('/:id/leaderboard', protect, getContestLeaderboard);

// Admin only
router.post('/', protect, admin, createContest);
router.delete('/:id', protect, admin, deleteContest);

module.exports = router;

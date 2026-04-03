const Contest = require('../models/contestModel');
const crypto = require('crypto');

// Generate a short room code
const generateRoomCode = () => crypto.randomBytes(3).toString('hex').toUpperCase();

// @desc    Create a contest
// @route   POST /api/contests
// @access  Protected (admin)
const createContest = async (req, res) => {
  try {
    const { title, description, problems, startTime, duration, isPublic } = req.body;

    if (!title || !problems || !startTime || !duration) {
      return res.status(400).json({ message: "Title, problems, startTime, and duration are required" });
    }

    if (problems.length === 0) {
      return res.status(400).json({ message: "At least one problem is required" });
    }

    const contest = await Contest.create({
      title,
      description: description || "",
      createdBy: req.user._id,
      problems,
      startTime: new Date(startTime),
      duration,
      isPublic: isPublic !== false,
      roomCode: generateRoomCode(),
    });

    res.status(201).json(contest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all contests
// @route   GET /api/contests
// @access  Protected
const getContests = async (req, res) => {
  try {
    const contests = await Contest.find()
      .populate('createdBy', 'username')
      .populate('problems', 'name difficulty')
      .sort({ startTime: -1 });

    // Auto-update status
    const now = new Date();
    const updated = contests.map(c => {
      const obj = c.toObject();
      if (now < new Date(obj.startTime)) obj.status = 'upcoming';
      else if (now < new Date(new Date(obj.startTime).getTime() + obj.duration * 60000)) obj.status = 'live';
      else obj.status = 'ended';
      return obj;
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single contest
// @route   GET /api/contests/:id
// @access  Protected
const getContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('problems')
      .populate('participants.user', 'username');

    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const obj = contest.toObject();
    const now = new Date();
    if (now < new Date(obj.startTime)) obj.status = 'upcoming';
    else if (now < new Date(new Date(obj.startTime).getTime() + obj.duration * 60000)) obj.status = 'live';
    else obj.status = 'ended';

    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Join a contest
// @route   POST /api/contests/:id/join
// @access  Protected
const joinContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    // Check if already joined
    const alreadyJoined = contest.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );
    if (alreadyJoined) return res.status(400).json({ message: "Already joined this contest" });

    // Check if contest has ended
    const now = new Date();
    const endTime = new Date(contest.startTime.getTime() + contest.duration * 60000);
    if (now > endTime) return res.status(400).json({ message: "Contest has already ended" });

    contest.participants.push({
      user: req.user._id,
      score: 0,
      solvedProblems: []
    });

    await contest.save();
    res.json({ message: "Joined contest successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Join contest by room code
// @route   POST /api/contests/join-code
// @access  Protected
const joinByCode = async (req, res) => {
  try {
    const { roomCode } = req.body;
    if (!roomCode) return res.status(400).json({ message: "Room code is required" });

    const contest = await Contest.findOne({ roomCode: roomCode.toUpperCase() });
    if (!contest) return res.status(404).json({ message: "Invalid room code" });

    const alreadyJoined = contest.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );
    if (alreadyJoined) {
      return res.json({ message: "Already joined", contestId: contest._id });
    }

    const now = new Date();
    const endTime = new Date(contest.startTime.getTime() + contest.duration * 60000);
    if (now > endTime) return res.status(400).json({ message: "Contest has already ended" });

    contest.participants.push({
      user: req.user._id,
      score: 0,
      solvedProblems: []
    });

    await contest.save();
    res.json({ message: "Joined contest successfully", contestId: contest._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Submit a solution in a contest
// @route   POST /api/contests/:id/submit
// @access  Protected
const contestSubmit = async (req, res) => {
  try {
    const { problemId, verdict } = req.body;
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    // Check if contest is live
    const now = new Date();
    const endTime = new Date(contest.startTime.getTime() + contest.duration * 60000);
    if (now < contest.startTime || now > endTime) {
      return res.status(400).json({ message: "Contest is not currently live" });
    }

    // Find participant
    const participant = contest.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );
    if (!participant) return res.status(400).json({ message: "You have not joined this contest" });

    // Only update score if accepted and not already solved
    if (verdict === 'Accepted' && !participant.solvedProblems.includes(problemId)) {
      participant.solvedProblems.push(problemId);
      participant.score += 1;
    }

    await contest.save();
    res.json({ score: participant.score, solvedProblems: participant.solvedProblems });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get contest leaderboard
// @route   GET /api/contests/:id/leaderboard
// @access  Protected
const getContestLeaderboard = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('participants.user', 'username');

    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const leaderboard = contest.participants
      .map(p => ({
        username: p.user?.username || 'Unknown',
        userId: p.user?._id,
        score: p.score,
        solvedCount: p.solvedProblems.length,
        joinedAt: p.joinedAt
      }))
      .sort((a, b) => b.score - a.score || a.joinedAt - b.joinedAt);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a contest
// @route   DELETE /api/contests/:id
// @access  Protected (admin)
const deleteContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    await Contest.findByIdAndDelete(req.params.id);
    res.json({ message: "Contest deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createContest,
  getContests,
  getContest,
  joinContest,
  joinByCode,
  contestSubmit,
  getContestLeaderboard,
  deleteContest,
};

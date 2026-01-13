const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Submission = require('../models/submissionModel');
const Problem = require('../models/problemModel');

exports.registerUser = async (req, res) => {
  const { username, email, password, adminSecret } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: "All fields required" });

  if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({ message: "Password too weak: Need 8 chars, uppercase, and a number" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = (adminSecret === process.env.ADMIN_SECRET_KEY) ? 'admin' : 'user';

    await User.create({ username, email, password: hashedPassword, role });
    res.status(201).json({ message: "Registered" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getLeaderboard = async (req, res) => {
  try {
    const submissions = await Submission.find({ verdict: 'Accepted' }).populate('user');
    const userMap = {};

    submissions.forEach(sub => {
      if (sub.user && sub.problem) {
        const uid = sub.user._id.toString();
        if (!userMap[uid]) userMap[uid] = { username: sub.user.username, solved: new Set() };
        userMap[uid].solved.add(sub.problem.toString());
      }
    });

    const leaderboard = Object.values(userMap)
      .map(u => ({ username: u.username, solved: u.solved.size }))
      .sort((a, b) => b.solved - a.solved).slice(0, 10);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Leaderboard error" });
  }
};

// @desc    Get user statistics and activity (Sync this with the PUT request)
// @route   GET /api/users/profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // Get full user object
    const submissions = await Submission.find({ user: req.user._id }).populate('problem');
    const validSubmissions = submissions.filter(s => s.problem !== null);
    
    const acceptedSubmissions = validSubmissions.filter(s => s.verdict === 'Accepted');
    const solvedIds = [...new Set(acceptedSubmissions.map(s => s.problem._id.toString()))];
    const solvedProblems = await Problem.find({ _id: { $in: solvedIds } });

    const stats = {
      totalSolved: solvedIds.length,
      easy: solvedProblems.filter(p => p.difficulty === 'Easy').length,
      medium: solvedProblems.filter(p => p.difficulty === 'Medium').length,
      hard: solvedProblems.filter(p => p.difficulty === 'Hard').length,
      accuracy: validSubmissions.length > 0 ? ((acceptedSubmissions.length / validSubmissions.length) * 100).toFixed(1) : 0
    };

    res.json({ 
      // Ensure all these fields are sent back to the frontend
      user: { 
        username: user.username, 
        email: user.email,
        bio: user.bio,
        github: user.github,
        linkedin: user.linkedin,
        location: user.location,
        profilePic: user.profilePic
      }, 
      stats, 
      recentActivity: validSubmissions.slice(0, 10) 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/users/profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Use explicit checks to allow empty strings or new values
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.github = req.body.github !== undefined ? req.body.github : user.github;
      user.linkedin = req.body.linkedin !== undefined ? req.body.linkedin : user.linkedin;
      user.location = req.body.location !== undefined ? req.body.location : user.location;
      user.profilePic = req.body.profilePic !== undefined ? req.body.profilePic : user.profilePic;

      await user.save(); // Persist to MongoDB
      res.json({ message: "Profile updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
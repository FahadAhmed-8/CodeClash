const Submission = require('../models/submissionModel');

// @desc    Create new submission
exports.createSubmission = async (req, res) => {
  try {
    const { problemId, code, language, verdict } = req.body;
    const submission = await Submission.create({
      user: req.user._id, 
      problem: problemId,
      code,
      language,
      verdict
    });
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: "Failed to save submission", error: error.message });
  }
};

// @desc    Get all submissions for the logged-in user
exports.getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate('problem', 'name difficulty')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};

// @desc    Get single submission details (Modal)
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('problem', 'name statement')
      .populate('user', 'username');

    if (!submission) return res.status(404).json({ message: "Submission not found" });

    // Security: Only owner or admin can view the code
    if (submission.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to view this code" });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: "Error fetching details", error: error.message });
  }
};
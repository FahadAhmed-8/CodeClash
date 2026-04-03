const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  }],
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now },
    score: { type: Number, default: 0 },
    solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }]
  }],
  startTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 5,
    max: 300
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'ended'],
    default: 'upcoming'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  roomCode: {
    type: String,
    unique: true,
    sparse: true
  }
}, { timestamps: true });

// Virtual: end time
contestSchema.virtual('endTime').get(function () {
  return new Date(this.startTime.getTime() + this.duration * 60000);
});

// Auto-compute status based on time
contestSchema.methods.computeStatus = function () {
  const now = new Date();
  if (now < this.startTime) return 'upcoming';
  if (now >= this.startTime && now < this.endTime) return 'live';
  return 'ended';
};

contestSchema.set('toJSON', { virtuals: true });
contestSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Contest', contestSchema);

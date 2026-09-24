const User = require('../models/User');
const Connection = require('../models/Connection');
const { calculateMatchScore } = require('../utils/matchingAlgorithm');

// @desc    Get smart skill matches for logged-in user
// @route   GET /api/matches
// @access  Private
exports.getMatches = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find all potential candidate peers (excluding current user)
    const candidates = await User.find({ _id: { $ne: req.user.id } });

    // Fetch existing connections for current user to show connection status
    const connections = await Connection.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    });

    const connectionMap = {};
    connections.forEach((conn) => {
      const otherUserId =
        conn.sender.toString() === req.user.id ? conn.receiver.toString() : conn.sender.toString();
      connectionMap[otherUserId] = {
        id: conn._id,
        status: conn.status,
        isSender: conn.sender.toString() === req.user.id,
      };
    });

    // Score and rank each candidate
    const scoredMatches = candidates.map((candidate) => {
      const matchResult = calculateMatchScore(currentUser, candidate);
      const connInfo = connectionMap[candidate._id.toString()] || null;

      return {
        _id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        college: candidate.college,
        bio: candidate.bio,
        profileImage: candidate.profileImage,
        skillsToTeach: candidate.skillsToTeach,
        skillsToLearn: candidate.skillsToLearn,
        skillLevel: candidate.skillLevel,
        rating: candidate.rating,
        reviewCount: candidate.reviewCount,
        completedSessionsCount: candidate.completedSessionsCount,
        availableTimings: candidate.availableTimings,
        isAvailableForSessions: candidate.isAvailableForSessions,
        // Match calculation fields
        matchScore: matchResult.score,
        matchPercentage: matchResult.matchPercentage,
        isMutual: matchResult.isMutual,
        canTeachYou: matchResult.canTeachYou,
        youCanTeachThem: matchResult.youCanTeachThem,
        connectionStatus: connInfo ? connInfo.status : 'none',
        connectionId: connInfo ? connInfo.id : null,
        isConnectionSender: connInfo ? connInfo.isSender : false,
      };
    });

    // Sort by Match Percentage descending, then Rating descending
    scoredMatches.sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      return b.rating - a.rating;
    });

    res.status(200).json({
      success: true,
      count: scoredMatches.length,
      matches: scoredMatches,
    });
  } catch (error) {
    next(error);
  }
};

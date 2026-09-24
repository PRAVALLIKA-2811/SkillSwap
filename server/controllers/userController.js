const User = require('../models/User');
const Review = require('../models/Review');
const { calculateMatchScore } = require('../utils/matchingAlgorithm');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const reviews = await Review.find({ reviewedUser: req.user.id })
      .populate('reviewer', 'name profileImage college')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      college,
      bio,
      profileImage,
      skillsToTeach,
      skillsToLearn,
      skillLevel,
      availableTimings,
      isAvailableForSessions,
    } = req.body;

    const fieldsToUpdate = {};
    if (name !== undefined) fieldsToUpdate.name = name;
    if (college !== undefined) fieldsToUpdate.college = college;
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (profileImage !== undefined) fieldsToUpdate.profileImage = profileImage;
    if (skillsToTeach !== undefined) fieldsToUpdate.skillsToTeach = skillsToTeach;
    if (skillsToLearn !== undefined) fieldsToUpdate.skillsToLearn = skillsToLearn;
    if (skillLevel !== undefined) fieldsToUpdate.skillLevel = skillLevel;
    if (availableTimings !== undefined) fieldsToUpdate.availableTimings = availableTimings;
    if (isAvailableForSessions !== undefined)
      fieldsToUpdate.isAvailableForSessions = isAvailableForSessions;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile by ID with match score
// @route   GET /api/users/:id
// @access  Private / Public
exports.getUserById = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const reviews = await Review.find({ reviewedUser: req.params.id })
      .populate('reviewer', 'name profileImage college')
      .sort({ createdAt: -1 });

    let matchInfo = null;
    if (req.user && req.user._id.toString() !== targetUser._id.toString()) {
      matchInfo = calculateMatchScore(req.user, targetUser);
    }

    res.status(200).json({
      success: true,
      user: targetUser,
      reviews,
      matchInfo,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search and filtering
// @route   GET /api/users
// @access  Private
exports.getAllUsers = async (req, res, next) => {
  try {
    const { search, skill, level, college } = req.query;
    const query = { _id: { $ne: req.user.id } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
        { 'skillsToTeach.name': { $regex: search, $options: 'i' } },
        { 'skillsToLearn.name': { $regex: search, $options: 'i' } },
      ];
    }

    if (college) {
      query.college = { $regex: college, $options: 'i' };
    }

    if (skill) {
      query.$or = [
        { 'skillsToTeach.name': { $regex: skill, $options: 'i' } },
        { 'skillsToLearn.name': { $regex: skill, $options: 'i' } },
      ];
    }

    if (level) {
      query['skillsToTeach.level'] = level;
    }

    const users = await User.find(query).sort({ rating: -1, completedSessionsCount: -1 });

    // Compute match score for each user relative to logged in user
    const usersWithMatch = users.map((user) => {
      const match = calculateMatchScore(req.user, user);
      return {
        ...user.toObject(),
        matchScore: match.score,
        matchPercentage: match.matchPercentage,
        isMutual: match.isMutual,
        canTeachYou: match.canTeachYou,
        youCanTeachThem: match.youCanTeachThem,
      };
    });

    res.status(200).json({
      success: true,
      count: usersWithMatch.length,
      users: usersWithMatch,
    });
  } catch (error) {
    next(error);
  }
};

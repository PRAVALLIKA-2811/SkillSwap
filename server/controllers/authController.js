const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      college,
      bio,
      skillsToTeach,
      skillsToLearn,
      skillLevel,
      profileImage,
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Parse skills if passed as strings/arrays
    let formattedTeach = [];
    if (Array.isArray(skillsToTeach)) {
      formattedTeach = skillsToTeach.map((s) =>
        typeof s === 'string' ? { name: s.trim(), level: skillLevel || 'Intermediate' } : s
      );
    } else if (typeof skillsToTeach === 'string' && skillsToTeach.trim()) {
      formattedTeach = skillsToTeach.split(',').map((s) => ({
        name: s.trim(),
        level: skillLevel || 'Intermediate',
      }));
    }

    let formattedLearn = [];
    if (Array.isArray(skillsToLearn)) {
      formattedLearn = skillsToLearn.map((s) =>
        typeof s === 'string' ? { name: s.trim(), level: 'Beginner' } : s
      );
    } else if (typeof skillsToLearn === 'string' && skillsToLearn.trim()) {
      formattedLearn = skillsToLearn.split(',').map((s) => ({
        name: s.trim(),
        level: 'Beginner',
      }));
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      college: college || 'University of Technology',
      bio: bio || 'Eager to exchange knowledge on SkillSwap!',
      skillsToTeach: formattedTeach,
      skillsToLearn: formattedLearn,
      skillLevel: skillLevel || 'Intermediate',
      profileImage: profileImage || '',
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        bio: user.bio,
        skillsToTeach: user.skillsToTeach,
        skillsToLearn: user.skillsToLearn,
        skillLevel: user.skillLevel,
        rating: user.rating,
        reviewCount: user.reviewCount,
        completedSessionsCount: user.completedSessionsCount,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        bio: user.bio,
        skillsToTeach: user.skillsToTeach,
        skillsToLearn: user.skillsToLearn,
        skillLevel: user.skillLevel,
        rating: user.rating,
        reviewCount: user.reviewCount,
        completedSessionsCount: user.completedSessionsCount,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new passwords',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      token,
    });
  } catch (error) {
    next(error);
  }
};

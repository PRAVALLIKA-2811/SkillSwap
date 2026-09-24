const User = require('../models/User');

// @desc    Get current user skills
// @route   GET /api/skills
// @access  Private
exports.getMySkills = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('skillsToTeach skillsToLearn');
    res.status(200).json({
      success: true,
      skillsToTeach: user.skillsToTeach || [],
      skillsToLearn: user.skillsToLearn || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add skill to teach
// @route   POST /api/skills/teach
// @access  Private
exports.addSkillToTeach = async (req, res, next) => {
  try {
    const { name, level } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required',
      });
    }

    const user = await User.findById(req.user.id);
    const exists = user.skillsToTeach.some(
      (s) => s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'You have already added this skill to your teaching list',
      });
    }

    user.skillsToTeach.push({
      name: name.trim(),
      level: level || 'Intermediate',
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Teaching skill added',
      skillsToTeach: user.skillsToTeach,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove skill to teach
// @route   DELETE /api/skills/teach/:skillName
// @access  Private
exports.removeSkillToTeach = async (req, res, next) => {
  try {
    const { skillName } = req.params;
    const user = await User.findById(req.user.id);

    user.skillsToTeach = user.skillsToTeach.filter(
      (s) => s.name.toLowerCase() !== decodeURIComponent(skillName).toLowerCase()
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Teaching skill removed',
      skillsToTeach: user.skillsToTeach,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add skill to learn
// @route   POST /api/skills/learn
// @access  Private
exports.addSkillToLearn = async (req, res, next) => {
  try {
    const { name, level } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required',
      });
    }

    const user = await User.findById(req.user.id);
    const exists = user.skillsToLearn.some(
      (s) => s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'You have already added this skill to your learning list',
      });
    }

    user.skillsToLearn.push({
      name: name.trim(),
      level: level || 'Beginner',
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Learning skill added',
      skillsToLearn: user.skillsToLearn,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove skill to learn
// @route   DELETE /api/skills/learn/:skillName
// @access  Private
exports.removeSkillToLearn = async (req, res, next) => {
  try {
    const { skillName } = req.params;
    const user = await User.findById(req.user.id);

    user.skillsToLearn = user.skillsToLearn.filter(
      (s) => s.name.toLowerCase() !== decodeURIComponent(skillName).toLowerCase()
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Learning skill removed',
      skillsToLearn: user.skillsToLearn,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update skills
// @route   PUT /api/skills
// @access  Private
exports.updateAllSkills = async (req, res, next) => {
  try {
    const { skillsToTeach, skillsToLearn } = req.body;

    const user = await User.findById(req.user.id);
    if (skillsToTeach !== undefined) user.skillsToTeach = skillsToTeach;
    if (skillsToLearn !== undefined) user.skillsToLearn = skillsToLearn;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Skills updated successfully',
      skillsToTeach: user.skillsToTeach,
      skillsToLearn: user.skillsToLearn,
    });
  } catch (error) {
    next(error);
  }
};

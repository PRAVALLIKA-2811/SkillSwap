const Session = require('../models/Session');
const User = require('../models/User');

// @desc    Schedule a new learning/teaching session
// @route   POST /api/sessions
// @access  Private
exports.createSession = async (req, res, next) => {
  try {
    const { partnerId, role, skill, date, time, duration, notes, meetingLink } = req.body;

    if (!partnerId || !skill || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Partner, skill, date, and time are required',
      });
    }

    if (partnerId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot schedule a session with yourself',
      });
    }

    const partner = await User.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner user not found' });
    }

    // Determine teacher and learner based on role ('teacher' or 'learner' selected by current user)
    let teacherId = req.user.id;
    let learnerId = partnerId;

    if (role === 'learner' || role === 'learn') {
      teacherId = partnerId;
      learnerId = req.user.id;
    }

    // Default meeting room if not specified
    const generatedMeetingLink =
      meetingLink || `https://meet.jit.si/skillswap-${Date.now().toString(36)}`;

    const session = await Session.create({
      teacher: teacherId,
      learner: learnerId,
      skill,
      date,
      time,
      duration: duration || 60,
      notes: notes || '',
      meetingLink: generatedMeetingLink,
      status: 'pending',
    });

    const populatedSession = await Session.findById(session._id)
      .populate('teacher', 'name email college profileImage rating')
      .populate('learner', 'name email college profileImage rating');

    res.status(201).json({
      success: true,
      message: 'Session requested successfully',
      session: populatedSession,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's sessions (as teacher or learner)
// @route   GET /api/sessions
// @access  Private
exports.getMySessions = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;

    const sessions = await Session.find({
      $or: [{ teacher: currentUserId }, { learner: currentUserId }],
    })
      .populate('teacher', 'name email college profileImage rating')
      .populate('learner', 'name email college profileImage rating')
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept session request
// @route   PUT /api/sessions/:id/accept
// @access  Private
exports.acceptSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Only the other participant can accept
    const isTeacher = session.teacher.toString() === req.user.id;
    const isLearner = session.learner.toString() === req.user.id;

    if (!isTeacher && !isLearner) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    session.status = 'accepted';
    await session.save();

    const populated = await Session.findById(session._id)
      .populate('teacher', 'name email college profileImage rating')
      .populate('learner', 'name email college profileImage rating');

    res.status(200).json({
      success: true,
      message: 'Session accepted',
      session: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel session
// @route   PUT /api/sessions/:id/cancel
// @access  Private
exports.cancelSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const isTeacher = session.teacher.toString() === req.user.id;
    const isLearner = session.learner.toString() === req.user.id;

    if (!isTeacher && !isLearner) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    session.status = 'cancelled';
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Session cancelled',
      session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark session as completed
// @route   PUT /api/sessions/:id/complete
// @access  Private
exports.completeSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const isTeacher = session.teacher.toString() === req.user.id;
    const isLearner = session.learner.toString() === req.user.id;

    if (!isTeacher && !isLearner) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    session.status = 'completed';
    await session.save();

    // Increment completed sessions count for both participants
    await User.findByIdAndUpdate(session.teacher, { $inc: { completedSessionsCount: 1 } });
    await User.findByIdAndUpdate(session.learner, { $inc: { completedSessionsCount: 1 } });

    const populated = await Session.findById(session._id)
      .populate('teacher', 'name email college profileImage rating')
      .populate('learner', 'name email college profileImage rating');

    res.status(200).json({
      success: true,
      message: 'Session marked as completed! You can now leave a review.',
      session: populated,
    });
  } catch (error) {
    next(error);
  }
};

const Review = require('../models/Review');
const Session = require('../models/Session');
const User = require('../models/User');

// @desc    Add review for a completed session
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { sessionId, rating, comment } = req.body;

    if (!sessionId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Session ID, rating (1-5), and comment are required',
      });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review sessions that are completed',
      });
    }

    const isTeacher = session.teacher.toString() === req.user.id;
    const isLearner = session.learner.toString() === req.user.id;

    if (!isTeacher && !isLearner) {
      return res.status(403).json({
        success: false,
        message: 'You were not a participant in this session',
      });
    }

    // Reviewed user is the other peer in the session
    const reviewedUserId = isLearner ? session.teacher : session.learner;

    // Check if review already exists
    const existingReview = await Review.findOne({
      reviewer: req.user.id,
      session: sessionId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this session',
      });
    }

    const review = await Review.create({
      reviewer: req.user.id,
      reviewedUser: reviewedUserId,
      session: sessionId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    session.reviewed = true;
    await session.save();

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name profileImage college')
      .populate('reviewedUser', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! Thank you.',
      review: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Private / Public
exports.getUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ reviewedUser: userId })
      .populate('reviewer', 'name profileImage college')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

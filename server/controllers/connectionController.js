const Connection = require('../models/Connection');
const User = require('../models/User');

// @desc    Send connection request
// @route   POST /api/connections/request
// @access  Private
exports.sendRequest = async (req, res, next) => {
  try {
    const { receiverId, note } = req.body;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: 'Receiver ID is required' });
    }

    if (receiverId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a connection request to yourself',
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Target user not found' });
    }

    // Check if a connection already exists in either direction
    const existing = await Connection.findOne({
      $or: [
        { sender: req.user.id, receiver: receiverId },
        { sender: receiverId, receiver: req.user.id },
      ],
    });

    if (existing) {
      if (existing.status === 'accepted') {
        return res.status(400).json({ success: false, message: 'You are already connected' });
      }
      if (existing.status === 'pending') {
        return res.status(400).json({ success: false, message: 'A connection request is already pending' });
      }
      // If rejected, allow resetting to pending
      existing.status = 'pending';
      existing.sender = req.user.id;
      existing.receiver = receiverId;
      existing.note = note || 'Hey! I would love to connect and exchange skills with you.';
      await existing.save();
      return res.status(200).json({ success: true, message: 'Connection request sent', connection: existing });
    }

    const connection = await Connection.create({
      sender: req.user.id,
      receiver: receiverId,
      note: note || 'Hey! I would love to connect and exchange skills with you.',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      connection,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending received requests and sent requests
// @route   GET /api/connections/requests
// @access  Private
exports.getRequests = async (req, res, next) => {
  try {
    const receivedRequests = await Connection.find({
      receiver: req.user.id,
      status: 'pending',
    }).populate('sender', 'name email college bio skillsToTeach skillsToLearn rating profileImage');

    const sentRequests = await Connection.find({
      sender: req.user.id,
      status: 'pending',
    }).populate('receiver', 'name email college bio skillsToTeach skillsToLearn rating profileImage');

    res.status(200).json({
      success: true,
      received: receivedRequests,
      sent: sentRequests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all accepted connections
// @route   GET /api/connections
// @access  Private
exports.getConnections = async (req, res, next) => {
  try {
    const connections = await Connection.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
      status: 'accepted',
    })
      .populate('sender', 'name email college bio skillsToTeach skillsToLearn rating profileImage availableTimings')
      .populate('receiver', 'name email college bio skillsToTeach skillsToLearn rating profileImage availableTimings')
      .sort({ updatedAt: -1 });

    // Format list so that the "partner" object is easily accessible
    const partnerList = connections.map((conn) => {
      const isSender = conn.sender._id.toString() === req.user.id;
      const partner = isSender ? conn.receiver : conn.sender;
      return {
        connectionId: conn._id,
        connectedAt: conn.updatedAt,
        partner,
      };
    });

    res.status(200).json({
      success: true,
      count: partnerList.length,
      connections: partnerList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept connection request
// @route   PUT /api/connections/:id/accept
// @access  Private
exports.acceptRequest = async (req, res, next) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection request not found' });
    }

    if (connection.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this connection request',
      });
    }

    connection.status = 'accepted';
    await connection.save();

    res.status(200).json({
      success: true,
      message: 'Connection request accepted!',
      connection,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject connection request
// @route   PUT /api/connections/:id/reject
// @access  Private
exports.rejectRequest = async (req, res, next) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection request not found' });
    }

    if (connection.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this connection request',
      });
    }

    connection.status = 'rejected';
    await connection.save();

    res.status(200).json({
      success: true,
      message: 'Connection request declined',
      connection,
    });
  } catch (error) {
    next(error);
  }
};

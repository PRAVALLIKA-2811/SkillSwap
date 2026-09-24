const Message = require('../models/Message');
const User = require('../models/User');
const Connection = require('../models/Connection');

// @desc    Get all conversations for the logged in user
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;

    // Find all messages involving current user
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name profileImage college')
      .populate('receiver', 'name profileImage college');

    // Group by conversation partner
    const conversationMap = new Map();

    messages.forEach((msg) => {
      const isSender = msg.sender._id.toString() === currentUserId;
      const partner = isSender ? msg.receiver : msg.sender;
      const partnerId = partner._id.toString();

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          partner,
          lastMessage: {
            text: msg.message,
            timestamp: msg.createdAt,
            sender: msg.sender._id,
            read: msg.read,
          },
          unreadCount: 0,
        });
      }

      if (!isSender && !msg.read) {
        const convo = conversationMap.get(partnerId);
        convo.unreadCount += 1;
      }
    });

    const conversations = Array.from(conversationMap.values());

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat message history with a specific user
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessagesWithUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage');

    // Mark unread messages sent to current user as read
    await Message.updateMany(
      { sender: userId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );

    const partner = await User.findById(userId).select('name email college profileImage skillsToTeach skillsToLearn rating availableTimings');

    res.status(200).json({
      success: true,
      partner,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message to a user
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId || !message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Receiver and non-empty message text are required',
      });
    }

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      message: message.trim(),
      read: false,
    });

    const populated = await Message.findById(newMessage._id)
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage');

    res.status(201).json({
      success: true,
      message: populated,
    });
  } catch (error) {
    next(error);
  }
};

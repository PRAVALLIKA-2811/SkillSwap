const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getUserById,
  getAllUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserById);

module.exports = router;

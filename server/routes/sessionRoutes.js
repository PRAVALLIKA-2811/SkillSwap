const express = require('express');
const router = express.Router();
const {
  createSession,
  getMySessions,
  acceptSession,
  cancelSession,
  completeSession,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

router.use(protect); // All session routes are protected

router.post('/', createSession);
router.get('/', getMySessions);
router.put('/:id/accept', acceptSession);
router.put('/:id/cancel', cancelSession);
router.put('/:id/complete', completeSession);

module.exports = router;

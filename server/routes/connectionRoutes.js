const express = require('express');
const router = express.Router();
const {
  sendRequest,
  getRequests,
  getConnections,
  acceptRequest,
  rejectRequest,
} = require('../controllers/connectionController');
const { protect } = require('../middleware/auth');

router.use(protect); // All connection routes are protected

router.post('/request', sendRequest);
router.get('/requests', getRequests);
router.get('/', getConnections);
router.put('/:id/accept', acceptRequest);
router.put('/:id/reject', rejectRequest);

module.exports = router;

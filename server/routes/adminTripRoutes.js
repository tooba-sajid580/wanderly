const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const adminTrip = require('../controllers/adminTripController');

router.post('/', authMiddleware, adminMiddleware, adminTrip.createTrip);
router.put('/:tripId', authMiddleware, adminMiddleware, adminTrip.editTrip);
router.delete('/:tripId', authMiddleware, adminMiddleware, adminTrip.cancelTrip);
router.get('/:tripId/members', authMiddleware, adminMiddleware, adminTrip.getTripMembers);

module.exports = router;
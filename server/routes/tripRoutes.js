const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuth');
const trips = require('../controllers/tripController');

router.get('/my-trips', authMiddleware, trips.getMyTrips);
router.get('/', trips.getAllTrips);
router.get('/:tripId', optionalAuth, trips.getTripById);
router.post('/:tripId/join', authMiddleware, trips.joinTrip);
router.delete('/:tripId/leave', authMiddleware, trips.leaveTrip);
router.get('/:tripId/members', authMiddleware, trips.getTripAttendees);

module.exports = router;
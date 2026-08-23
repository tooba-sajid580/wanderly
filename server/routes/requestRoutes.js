const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const requests = require('../controllers/requestController');

router.post('/', authMiddleware, requests.submitRequest);
router.get('/my-requests', authMiddleware, requests.getMyRequests);
router.get('/', authMiddleware, adminMiddleware, requests.getAllRequests);
router.put('/:requestId', authMiddleware, adminMiddleware, requests.respondToRequest);

module.exports = router;
const TripRequest = require('../models/TripRequest');

// Regular user: submit a new trip idea
async function submitRequest(req, res) {
  try {
    const { destinationRequest, preferredDate, notes } = req.body;

    const newRequest = await TripRequest.create({
      userId: req.user.id,
      destinationRequest,
      preferredDate,
      notes,
    });

    res.status(201).json({ request: newRequest });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// Regular user: see their own submitted requests
async function getMyRequests(req, res) {
  try {
    const userId = req.user.id;

    const myRequests = await TripRequest.find({ userId });

    res.status(200).json({ requests: myRequests });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// Admin: see all requests, with who submitted them
async function getAllRequests(req, res) {
  try {
    const allRequests = await TripRequest.find({}).populate("userId", "name email");

    res.status(200).json({ requests: allRequests });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// Admin: approve or reject a specific request
async function respondToRequest(req, res) {
  try {
    const requestId = req.params.requestId;

    const findRequest = await TripRequest.findById(requestId);
    if (!findRequest) {
      return res.status(404).json({ message: "Request not found." });
    }

    const { status, adminResponse } = req.body;

    findRequest.status = status;
    findRequest.adminResponse = adminResponse;
    await findRequest.save();

    res.status(200).json({ request: findRequest });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

module.exports = { submitRequest, getMyRequests, getAllRequests, respondToRequest };
const mongoose = require('mongoose');
const TripRequest = require('../models/TripRequest');

// Statuses an admin can respond with ("pending" is the starting state)
const RESPONSE_STATUSES = ['approved', 'rejected'];

// Regular user: submit a new trip idea
async function submitRequest(req, res) {
  try {
    const { destinationRequest, preferredDate, notes } = req.body;

    if (!destinationRequest) {
      return res.status(400).json({ message: "Please tell us where you'd like to go." });
    }

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
    const myRequests = await TripRequest.find({ userId: req.user.id })
      .populate("handledBy", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ requests: myRequests });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// Admin: see every request. Each one says whether THIS admin can respond.
async function getAllRequests(req, res) {
  try {
    const allRequests = await TripRequest.find({})
      .populate("userId", "name email")
      .populate("handledBy", "name")
      .sort({ createdAt: -1 });

    const requests = allRequests.map((request) => {
      const data = request.toObject();
      data.canRespond = !request.handledBy || request.handledBy._id.equals(req.user.id);
      return data;
    });

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// Admin: approve or reject. The first admin to respond claims the request.
async function respondToRequest(req, res) {
  try {
    const { requestId } = req.params;
    const { status, adminResponse } = req.body;

    if (!mongoose.isValidObjectId(requestId)) {
      return res.status(404).json({ message: "Request not found." });
    }
    if (!RESPONSE_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected." });
    }

    // One atomic update: it only succeeds if the request is unclaimed or
    // already belongs to this admin, so two admins can't both claim it.
    const updated = await TripRequest.findOneAndUpdate(
      {
        _id: requestId,
        $or: [{ handledBy: null }, { handledBy: req.user.id }]
      },
      {
        $set: {
          status,
          adminResponse,
          handledBy: req.user.id,
          handledAt: new Date()
        }
      },
      { new: true }
    )
      .populate("userId", "name email")
      .populate("handledBy", "name");

    if (!updated) {
      const existing = await TripRequest.findById(requestId).populate("handledBy", "name");
      if (!existing) {
        return res.status(404).json({ message: "Request not found." });
      }
      return res.status(403).json({
        message: `This request was already handled by ${existing.handledBy?.name || "another organizer"}.`
      });
    }

    res.status(200).json({ request: updated });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

module.exports = { submitRequest, getMyRequests, getAllRequests, respondToRequest };
const Trip = require('../models/Trip');
const TripMember = require('../models/TripMembership');

function isOwner(trip, userId) {
  return Boolean(trip.createdBy) && trip.createdBy.equals(userId);
}

async function createTrip(req, res) {
  try {
    const { title, destination, startDate, endDate, description, category,
      capacity, pricePerPerson, images, itinerary } = req.body;

    const newTrip = await Trip.create({
      title, destination, startDate, endDate, description, category,
      capacity, pricePerPerson, images, itinerary,
      totalPrice: Number(pricePerPerson) * Number(capacity),
      createdBy: req.user.id
    });
    res.status(201).json({ trip: newTrip });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

async function editTrip(req, res) {
  try {
    const findTrip = await Trip.findById(req.params.tripId);
    if (!findTrip) {
      return res.status(404).json({ message: "Trip not found." });
    }
    if (!isOwner(findTrip, req.user.id)) {
      return res.status(403).json({ message: "You didn't create this trip." });
    }

    const allowed = ["title", "destination", "startDate", "endDate", "description", "category", "images"];
    const numeric = ["capacity", "pricePerPerson"];

    for (const key of allowed) {
      if (req.body[key] !== undefined) findTrip[key] = req.body[key];
    }
    for (const key of numeric) {
      const v = req.body[key];
      if (v !== undefined && v !== "") findTrip[key] = Number(v);
    }
    if (Array.isArray(req.body.itinerary)) {
      findTrip.itinerary = req.body.itinerary.map((d) => ({ ...d, day: Number(d.day) }));
    }

    findTrip.totalPrice = findTrip.pricePerPerson * findTrip.capacity;

    // Destination or dates may have changed, so drop the old forecast
    findTrip.weatherCache = undefined;
    findTrip.recommendationCache = undefined;

    await findTrip.save();
    res.status(200).json({ findTrip });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

async function cancelTrip(req, res) {
  try {
    const findTrip = await Trip.findById(req.params.tripId);
    if (!findTrip) {
      return res.status(404).json({ message: "Trip not found." });
    }
    if (!isOwner(findTrip, req.user.id)) {
      return res.status(403).json({ message: "You don't have access to this trip." });
    }
    findTrip.status = "cancelled";
    await findTrip.save();
    res.status(200).json({ findTrip });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

async function getTripMembers(req, res) {
  try {
    const tripId = req.params.tripId;
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }
    if (!isOwner(trip, req.user.id)) {
      return res.status(403).json({ message: "You don't have access to this trip." });
    }

    const members = await TripMember.find({ tripId }).populate("userId", "name email");
    const joinedCount = members.filter((m) => m.status === "confirmed").length;
    const spotsRemaining = trip.capacity - joinedCount;

    res.status(200).json({
      trip: { title: trip.title, capacity: trip.capacity },
      joinedCount,
      spotsRemaining,
      members
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

async function getMyPostedTrips(req, res) {
  try {
    const trips = await Trip.find({ createdBy: req.user.id });

    const tripsWithCounts = await Promise.all(
      trips.map(async (trip) => {
        const joinedCount = await TripMember.countDocuments({ tripId: trip._id, status: "confirmed" });
        return { ...trip.toObject(), joinedCount };
      })
    );

    res.status(200).json({ trips: tripsWithCounts });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

async function deleteTrip(req, res) {
  try {
    const tripId = req.params.tripId;
    const findTrip = await Trip.findById(tripId);
    if (!findTrip) {
      return res.status(404).json({ message: "Trip not found." });
    }
    if (!isOwner(findTrip, req.user.id)) {
      return res.status(403).json({ message: "You don't have access to this trip." });
    }

    await TripMember.deleteMany({ tripId });
    await Trip.findByIdAndDelete(tripId);

    res.status(200).json({ message: "Trip deleted permanently." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

module.exports = { createTrip, editTrip, cancelTrip, getTripMembers, getMyPostedTrips, deleteTrip };
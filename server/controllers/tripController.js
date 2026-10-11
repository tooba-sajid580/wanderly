const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const TripMember = require('../models/TripMembership');
const { getWeatherForTrip } = require('../services/weatherService');
const { getTripRecommendation, buildPackingList } = require('../services/aiRecommendationService');

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const THIRTY_MINUTES_MS = 30 * 60 * 1000;

function isOwner(trip, userId) {
  return Boolean(userId) && Boolean(trip.createdBy) && trip.createdBy.equals(userId);
}

// A good forecast is reused for 6 hours. A failed or "not yet available"
// result is retried after 30 minutes.
function isCacheStale(cache) {
  if (!cache || !cache.lastFetched) return true;
  const maxAge = cache.available ? SIX_HOURS_MS : THIRTY_MINUTES_MS;
  return Date.now() - new Date(cache.lastFetched).getTime() > maxAge;
}

// A missing or failed AI tip is retried after 30 minutes
function isTipStale(cache) {
  if (!cache || !cache.lastGenerated) return true;
  return Date.now() - new Date(cache.lastGenerated).getTime() > THIRTY_MINUTES_MS;
}

async function getFreshCaches(trip) {
  const current = trip.toObject();
  let weatherCache = current.weatherCache;
  let recommendationCache = current.recommendationCache;

  if (["cancelled", "completed"].includes(trip.status)) {
    return { weatherCache, recommendationCache };
  }

  let changed = false;

  if (isCacheStale(weatherCache)) {
    const weather = await getWeatherForTrip(trip.destination, trip.startDate);
    weatherCache = { ...weather, lastFetched: new Date() };
    recommendationCache = { available: false };
    changed = true;
  }

  if (weatherCache?.available && !recommendationCache?.text && isTipStale(recommendationCache)) {
    const tip = await getTripRecommendation(weatherCache, trip.category);
    recommendationCache = { ...tip, lastGenerated: tip.lastGenerated || new Date() };
    changed = true;
  }

  if (changed) {
    try {
      // updateOne skips full-document validation, so older trips still work
      await Trip.updateOne({ _id: trip._id }, { $set: { weatherCache, recommendationCache } });
    } catch (error) {
      console.error("Could not cache weather:", error.message);
    }
  }

  return { weatherCache, recommendationCache };
}

// Keeps status in step with the real number of confirmed members
async function syncTripStatus(tripId) {
  const trip = await Trip.findById(tripId).select("status capacity");
  if (!trip || !["open", "full"].includes(trip.status)) return;

  const confirmed = await TripMember.countDocuments({ tripId, status: "confirmed" });
  const newStatus = confirmed >= trip.capacity ? "full" : "open";

  if (newStatus !== trip.status) {
    await Trip.updateOne({ _id: tripId }, { $set: { status: newStatus } });
  }
}

const joinTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    if (!mongoose.isValidObjectId(tripId)) {
      return res.status(404).json({ message: "Trip not found." });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }
    if (["cancelled", "completed"].includes(trip.status)) {
      return res.status(400).json({ message: "This trip is no longer open for joining." });
    }
    if (isOwner(trip, userId)) {
      return res.status(400).json({ message: "You organized this trip, so you're already part of it." });
    }

    const alreadyJoined = await TripMember.findOne({ tripId, userId });
    if (alreadyJoined) {
      return res.status(400).json({ message: "Already joined this trip." });
    }

    const confirmCount = await TripMember.countDocuments({ tripId, status: "confirmed" });
    const isFull = confirmCount >= trip.capacity;

    const attendance = await TripMember.create({
      tripId,
      userId,
      status: isFull ? "waitlisted" : "confirmed",
    });

    await syncTripStatus(tripId);

    res.status(201).json({
      message: isFull ? "Trip is full. You're on the waitlist." : "Joined successfully!",
      attendance
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already joined this trip." });
    }
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const getTripAttendees = async (req, res) => {
  try {
    const { tripId } = req.params;

    if (!mongoose.isValidObjectId(tripId)) {
      return res.status(404).json({ message: "Trip not found." });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }

    const owner = isOwner(trip, req.user.id);
    if (!owner) {
      const membership = await TripMember.findOne({ tripId, userId: req.user.id });
      if (!membership) {
        return res.status(403).json({ message: "Join this trip to see who's going." });
      }
    }

    // Only the organizer sees emails and the waitlist
    const query = owner ? { tripId } : { tripId, status: "confirmed" };
    const attendees = await TripMember.find(query).populate(
      "userId",
      owner ? "name email" : "name"
    );

    res.status(200).json({ attendees });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

async function getAllTrips(req, res) {
  try {
    const trips = await Trip.find({ status: { $in: ["open", "full"] } })
      .select("-totalPrice -weatherCache -recommendationCache");

    // Count confirmed members per trip, so Home can show the most popular ones
    const counts = await TripMember.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: "$tripId", count: { $sum: 1 } } }
    ]);
    const countByTrip = new Map(counts.map((c) => [String(c._id), c.count]));

    const tripsWithCounts = trips.map((trip) => ({
      ...trip.toObject(),
      joinedCount: countByTrip.get(String(trip._id)) || 0
    }));

    res.status(200).json({ trips: tripsWithCounts });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

async function getTripById(req, res) {
  try {
    const { tripId } = req.params;

    if (!mongoose.isValidObjectId(tripId)) {
      return res.status(404).json({ message: "Trip not found." });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }

    const userId = req.user?.id;
    const owner = isOwner(trip, userId);
    const membership = userId ? await TripMember.findOne({ tripId, userId }) : null;

    const responseData = trip.toObject();
    delete responseData.weatherCache;
    delete responseData.recommendationCache;
    if (!owner) {
      delete responseData.totalPrice;
    }

    const confirmedCount = await TripMember.countDocuments({ tripId, status: "confirmed" });
    responseData.spotsRemaining = Math.max(0, trip.capacity - confirmedCount);
    responseData.membershipStatus = membership ? membership.status : null;
    responseData.isOwner = owner;

    // Members and the organizer get the member list, weather and packing advice
    if (membership || owner) {
      responseData.members = await TripMember.find({ tripId, status: "confirmed" })
        .populate("userId", "name");

      const { weatherCache, recommendationCache } = await getFreshCaches(trip);
      responseData.weatherInfo = weatherCache;
      responseData.recommendation = {
        ...(recommendationCache || {}),
        items: buildPackingList(weatherCache, trip.category)
      };
    }

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

async function leaveTrip(req, res) {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    if (!mongoose.isValidObjectId(tripId)) {
      return res.status(404).json({ message: "Trip not found." });
    }

    const deletedMembership = await TripMember.findOneAndDelete({ tripId, userId });
    if (!deletedMembership) {
      return res.status(404).json({ message: "You haven't joined this trip." });
    }

    // A confirmed spot just opened up: promote the longest-waiting person
    if (deletedMembership.status === "confirmed") {
      const nextInLine = await TripMember.findOne({ tripId, status: "waitlisted" }).sort({ createdAt: 1 });
      if (nextInLine) {
        nextInLine.status = "confirmed";
        await nextInLine.save();
      }
    }

    await syncTripStatus(tripId);

    res.status(200).json({ message: "Left trip successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

async function getMyTrips(req, res) {
  try {
    const userId = req.user.id;

    const myMemberships = await TripMember.find({ userId }).populate("tripId");

    // Skip memberships whose trip no longer exists
    const activeMemberships = myMemberships.filter((membership) => membership.tripId);

    const trips = await Promise.all(
      activeMemberships.map(async (membership) => {
        const trip = membership.tripId;
        const { weatherCache, recommendationCache } = await getFreshCaches(trip);

        const tripData = trip.toObject();
        tripData.weatherCache = weatherCache;
        tripData.recommendationCache = recommendationCache;
        tripData.packingList = buildPackingList(weatherCache, trip.category);
        if (!isOwner(trip, userId)) {
          delete tripData.totalPrice;
        }

        return { membershipStatus: membership.status, trip: tripData };
      })
    );

    res.status(200).json({ trips });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

module.exports = { joinTrip, getTripAttendees, getAllTrips, getTripById, leaveTrip, getMyTrips };
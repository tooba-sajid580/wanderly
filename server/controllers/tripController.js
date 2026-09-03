const Trip = require('../models/Trip');
const TripMember = require('../models/TripMembership');
const { getWeatherForTrip } = require('../services/weatherService');
const { getTripRecommendation } = require('../services/aiRecommendationService');


const joinTrip = async (req, res) => {
    try {
        const tripId= req.params.tripId;
        const userId = req.user.id;
         
        const trip = await Trip.findById(tripId);
        if(!trip){
            return res.status(404).json({message: "Trip not found."});
        }
        const alreadyJoined = await TripMember.findOne(tripId,userId);
        if(alreadyJoined){
            return res.status(400).json({message:"Already Joined this trip."});
        }

        const confirmCount = await TripMember.countDocuments({tripId,status:"confirmed"});
        const isFull= confirmCount >= trip.capacity;
            
        const attendance = await TripMember.create({
            tripId,
            userId,
            status: isFull? "waitlisted" : "confirmed",
        });

        if (isFull && trip.status !== "full") {
        trip.status = "full";
        await trip.save();
        }
            res.status(201).json({ message: "Joined successfully", attendance });
    }catch (error) {
            res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const getTripAttendees = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const isAdmin = req.user.role === "admin";

        const attendees = await TripMember.find({ tripId }).populate(
            "userId",
            isAdmin ? "name email" : "name"
        );

            res.status(200).json({ attendees });
    }catch (error) {
            res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

async function getAllTrips(req, res) {
  try {
    const trips = await Trip.find({status: "open"});
       res.status(200).json({trips});
  } catch (error) {
       res.status(500).json({message:"Something went wrong",error:error.message});
  }
};


async function getTripById(req, res) {
  try {
    const tripId = req.params.tripId;
    const userId = req.user?.id;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }

    const membership = userId ? await TripMember.findOne({ tripId, userId }) : null;

    const responseData = { ...trip.toObject() };

    const isOwner = req.user?.id === trip.createdBy.toString();
    if (!isOwner) {
      delete responseData.totalPrice;
    }

    if (membership) {
      responseData.members = await TripMember.find({ tripId }).populate("userId", "name");

      const sixHoursMs = 6 * 60 * 60 * 1000;
      const isStale = !trip.weatherCache?.lastFetched ||
        (Date.now() - new Date(trip.weatherCache.lastFetched).getTime()) > sixHoursMs;

      if (isStale) {
        const weatherResult = await getWeatherForTrip(trip.destination, trip.startDate);
        trip.weatherCache = weatherResult;

        if (weatherResult.available) {
          const recommendationResult = await getTripRecommendation(trip.weatherCache, trip.category);
          trip.recommendationCache = recommendationResult;
        }
        await trip.save();
      }

      responseData.weatherInfo = trip.weatherCache;
      responseData.recommendation = trip.recommendationCache;
    }
    
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}


async function leaveTrip(req, res) {
  try {
    const tripId= req.params.tripId
    const userId= req.user.id;

    const deleteMembership = await TripMember.findOneAndDelete({tripId,userId});
    if(!deleteMembership){
        return res.status(404).json({ message: "You haven't joined this trip." });
    }
    if(deleteMembership.status==="confirmed"){
      const nextInLine= await TripMember.findOne({tripId,status:"waitlisted"}).sort({createdAt:1});
        if(nextInLine){
        nextInLine.status="confirmed";
        await nextInLine.save();
        }
    }

    const trip = await Trip.findById(tripId);
      if(trip && trip.status === "full") {
      trip.status = "open";
      await trip.save();
      }

    res.status(200).json({ message: "Left trip successfully" });

  }catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  
 }
};


async function getMyTrips(req, res) {
  try {
    const userId = req.user.id;

    const myMemberships = await TripMember.find({ userId }).populate("tripId");

    const sixHoursMs = 6 * 60 * 60 * 1000;

    const tripsWithWeather = await Promise.all(
      myMemberships.map(async (membership) => {
        const trip = membership.tripId;

        const isStale = !trip.weatherCache?.lastFetched ||
          (Date.now() - new Date(trip.weatherCache.lastFetched).getTime()) > sixHoursMs;

        if (isStale) {
          const weatherResult = await getWeatherForTrip(trip.destination, trip.startDate);
          trip.weatherCache = weatherResult;

          if (weatherResult.available) {
            const recommendationResult = await getTripRecommendation(trip.weatherCache, trip.category);
            trip.recommendationCache = recommendationResult;
          }

          await trip.save();
        }

        return {
          membershipStatus: membership.status,
          trip: trip,
        };
      })
    );

    res.status(200).json({ trips: tripsWithWeather });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

module.exports = { joinTrip, getTripAttendees, getAllTrips, getTripById, leaveTrip, getMyTrips };
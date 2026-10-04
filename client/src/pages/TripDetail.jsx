import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import WeatherCard from "../components/WeatherCard";
import RecommendationBadge from "../components/RecommendationBadge";
import MemberList from "../components/MemberList";
import PriceTag from "../components/PriceTag";
import "../styles/TripDetail.css";

function TripDetail() {
  const { tripId } = useParams();
  const { token } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const authConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  const fetchTripDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/trips/${tripId}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setTrip(response.data);
    } catch {
      setMessage("Could not load trip details");
    } finally {
      setLoading(false);
    }
  }, [tripId, token]);

  useEffect(() => {
    fetchTripDetails();
  }, [fetchTripDetails]);

  async function handleJoin() {
    if (!token) {
      setMessage("Please log in to join this trip");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/api/trips/${tripId}/join`,
        {},
        authConfig
      );
      setMessage(response.data.message);
      await fetchTripDetails();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not join trip");
    }
  }

  async function handleLeave() {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/trips/${tripId}/leave`,
        authConfig
      );
      setMessage(response.data.message);
      await fetchTripDetails();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not leave trip");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!trip) return <p>{message || "Trip not found"}</p>;

  const days = trip.startDate && trip.endDate
    ? Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1
    : "?";

  const isCancelled = trip.status === "cancelled";

  return (
    <div className="container">
      <div className="trip-cover">
        <div className="trip-cover-frame">
          {trip.images?.[0] ? <img src={trip.images[0]} alt={trip.title} /> : null}
          <div className="trip-cover-overlay">
            <h1>{trip.title}</h1>
            <p>{trip.category}{trip.destination && ` · ${trip.destination}`}</p>
          </div>
        </div>
      </div>

      <div className="trip-detail-body">
        <div className="trip-main">
          <section>
            <h3>About this trip</h3>
            <p>{trip.description}</p>
          </section>

          {trip.itinerary?.length > 0 && (
            <section>
              <h3>Itinerary</h3>
              {trip.itinerary.map((day, index) => (
                <p key={index}>Day {day.day} — {day.place}: {day.activities}</p>
              ))}
            </section>
          )}

          {trip.members && (
            <section>
              <h3>Who's going</h3>
              <MemberList members={trip.members} />
            </section>
          )}

          {trip.weatherInfo !== undefined && (
            <section>
              <WeatherCard weatherInfo={trip.weatherInfo} />
              <RecommendationBadge recommendation={trip.recommendation} />
            </section>
          )}
        </div>

        <div className="trip-sidebar">
          <span className="featured-badge">Featured</span>
          <h2>{trip.title}</h2>

          {trip.startDate && trip.endDate && (
            <p className="trip-dates">
              {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          )}

          <p className="trip-sidebar-meta">
            {days} days · {trip.capacity} travelers{trip.destination && ` · ${trip.destination}`}
          </p>
          <PriceTag price={trip.pricePerPerson} />

          <div className="join-box">
            <h4>Join this trip</h4>
            {trip.spotsRemaining !== undefined && (
              <>
                <p className="spots-label">Spots available</p>
                <p className="spots-value">{trip.spotsRemaining} of {trip.capacity} remaining</p>
              </>
            )}

            {isCancelled ? (
              <p className="join-message">This trip has been cancelled.</p>
            ) : trip.isOwner ? (
              <p className="spots-label">You're organizing this trip.</p>
            ) : trip.membershipStatus ? (
              <>
                <p className="spots-label">Your status</p>
                <p className="spots-value">
                  {trip.membershipStatus === "waitlisted" ? "On the waitlist" : "You're going"}
                </p>
                <button onClick={handleLeave} className="join-btn">Leave trip</button>
              </>
            ) : (
              <button onClick={handleJoin} className="join-btn">
                {trip.spotsRemaining <= 0 ? "Join waitlist" : "Join trip"}
              </button>
            )}

            {message && <p className="join-message">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripDetail;
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import WeatherCard from "../components/WeatherCard";
import RecommendationBadge from "../components/RecommendationBadge";
import "../styles/TripDetail.css";

function TripDetail() {
  const { tripId } = useParams();
  const { token } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchTripDetails() {
      try {
        const response = await axios.get(`http://localhost:5000/api/trips/${tripId}`);
        setTrip(response.data);
      } catch {
        setMessage("Could not load trip details");
      } finally {
        setLoading(false);
      }
    }
    fetchTripDetails();
  }, [tripId]);

  async function handleJoin() {
    try {
      await axios.post(
        `http://localhost:5000/api/trips/${tripId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Joined successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not join trip");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!trip) return <p>Trip not found</p>;

  const days = trip.startDate && trip.endDate
    ? Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1
    : "?";

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
              {trip.members.map((member) => (
                <span key={member._id} className="member-pill">{member.userId?.name}</span>
              ))}
            </section>
          )}

          <section>
            <WeatherCard weatherInfo={trip.weatherInfo} />
            <RecommendationBadge recommendation={trip.recommendation} />
          </section>
        </div>

        <div className="trip-sidebar">
          <span className="featured-badge">Featured</span>
          <h2>{trip.title}</h2>

          {trip.startDate && trip.endDate && (
            <p className="trip-dates">
              {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          )}

          {trip.destination && <p className="trip-sidebar-meta">{days} days · {trip.capacity} travelers · {trip.destination}</p>}
          <p className="trip-price">${trip.pricePerPerson?.toLocaleString()}</p>

          <div className="join-box">
            <h4>Join this trip</h4>
            <p className="spots-label">Spots available</p>
            <p className="spots-value">{trip.spotsRemaining} of {trip.capacity} remaining</p>
            <button onClick={handleJoin} className="join-btn">Join trip</button>
            {message && <p className="join-message">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripDetail;
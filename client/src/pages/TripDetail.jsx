import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

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

  if (loading) {
    return <p>Loading...</p>;
  }
  if (!trip) {
    return <p>Trip not found</p>;
  }

  return (
    <div>
      <h2>{trip.title}</h2>
      <p>{trip.destination}</p>
      <p>{trip.description}</p>
      <p>Capacity: {trip.capacity}</p>
      <button onClick={handleJoin}>Join trip</button>
      {message && <p>{message}</p>}

      {trip.weatherInfo && trip.weatherInfo.available && (
        <div>
          <p>{trip.weatherInfo.temperature}°C, {trip.weatherInfo.condition}</p>
        </div>
      )}

      {trip.recommendation && trip.recommendation.text && (
        <p>{trip.recommendation.text}</p>
      )}

      {trip.members && (
        <div>
          <h3>Who's going</h3>
          {trip.members.map((member) => (
            <span key={member._id}>{member.userId?.name}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default TripDetail;
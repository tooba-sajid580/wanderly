import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import TripCard from "../components/TripCard";
import WeatherCard from "../components/WeatherCard";
import RecommendationBadge from "../components/RecommendationBadge";
import "../styles/MyTrips.css";

function MyTrips() {
  const { token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMyTrips() {
      try {
        const response = await axios.get("http://localhost:5000/api/trips/my-trips", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrips(response.data.trips);
      } catch (err) {
        setError("Could not load your trips");
      } finally {
        setLoading(false);
      }
    }
    fetchMyTrips();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h2 className="page-heading">My Trips</h2>
      {trips.length === 0 ? (
        <p>You haven't joined any trips yet.</p>
      ) : (
        trips.map((entry) => (
          <div key={entry.trip._id} className="my-trip-entry">
            <TripCard trip={entry.trip} />
            <WeatherCard weatherInfo={entry.trip.weatherCache} />
            <RecommendationBadge recommendation={entry.trip.recommendationCache} />
            <p className="membership-status">{entry.membershipStatus}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyTrips;
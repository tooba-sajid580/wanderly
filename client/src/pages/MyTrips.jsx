import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import TripCard from "../components/TripCard";
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

  const tripsWithWeather = trips.filter((e) => e.trip.weatherCache?.available);

  return (
    <div className="container">
      <h2 className="page-heading">My trips</h2>
      <p className="page-subtext">Keep track of trips you've joined.</p>

      {trips.length === 0 ? (
        <p>You haven't joined any trips yet.</p>
      ) : (
        <>
          <div className="grid">
            {trips.map((entry) => (
              <div key={entry.trip._id} className="mytrip-card-wrapper">
                <TripCard trip={entry.trip} />
                <span className={`status-pill status-${entry.membershipStatus}`}>
                  {entry.membershipStatus}
                </span>
              </div>
            ))}
          </div>

          {tripsWithWeather.length > 0 && (
            <div className="weather-summary">
              <h3>Weather for your joined trips</h3>
              <p className="subtext">Quick conditions so you can plan what to pack before you go.</p>
              <div className="weather-summary-grid">
                {tripsWithWeather.map((entry) => (
                  <div key={entry.trip._id} className="weather-summary-item">
                    <p className="weather-place">{entry.trip.destination}</p>
                    <p className="temp">{entry.trip.weatherCache.temperature}°C</p>
                    <p className="condition">{entry.trip.weatherCache.condition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyTrips;
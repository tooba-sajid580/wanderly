import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import TripCard from "../components/TripCard";

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

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

 return (
  <div>
    <h2>My Trips</h2>
    {trips.length === 0 ? (
      <p>You haven't joined any trips yet.</p>
    ) : (
      trips.map((entry) => (
        <TripCard key={entry.trip._id} trip={entry.trip} />
      ))
    )}
  </div>
);
}

export default MyTrips;
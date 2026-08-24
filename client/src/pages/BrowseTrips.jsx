import { useState, useEffect } from "react";
import axios from "axios";
import TripCard from "../components/TripCard";

function BrowseTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTrips() {
      try {
        const response = await axios.get("http://localhost:5000/api/trips");
        setTrips(response.data.trips);
      } catch (err) {
        setError("Could not load trips");
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Open trips</h2>
      {trips.map((trip) => (
        <TripCard key={trip._id} trip={trip} />
      ))}
    </div>
  );
}

export default BrowseTrips;
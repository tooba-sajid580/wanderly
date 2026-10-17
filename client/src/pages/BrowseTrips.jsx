import { useState, useEffect } from "react";
import axios from "axios";
import TripCard from "../components/TripCard";
import "../styles/BrowseTrips.css";

function BrowseTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchTrips() {
      try {
        const response = await axios.get("/api/trips");
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

  const filteredTrips = trips.filter((trip) => {
    const term = searchTerm.toLowerCase();
    return (
      trip.destination?.toLowerCase().includes(term) ||
      trip.title?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container">
      <h2 className="page-heading">Browse trips</h2>
      <p className="page-subtext">Find an adventure that fits your plans.</p>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          placeholder='Search by destination — try "Hunza"'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn">Search</button>
      </div>

      <p className="results-count">
        {searchTerm
          ? `Showing ${filteredTrips.length} result${filteredTrips.length !== 1 ? "s" : ""} for "${searchTerm}"`
          : `Showing ${trips.length} of ${trips.length} trips`}
      </p>

      {filteredTrips.length === 0 ? (
        <p className="no-results">No trips found. Try a different destination.</p>
      ) : (
        <div className="grid">
          {filteredTrips.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseTrips;
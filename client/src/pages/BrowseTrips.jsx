import { useState, useEffect } from "react";
import axios from "axios";
import TripCard from "../components/TripCard";
import "../styles/BrowseTrips.css";

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
    
  <div className="container">
    <h2 className="page-heading">Browse trips</h2>
    <p className="page-subtext">Find an adventure that fits your plans.</p>

    <div className="search-bar">
      <div className="search-field">
        <label>Destination</label>
        <input placeholder="Where do you want to go?" />
      </div>
      <div className="search-field">
        <label>Date</label>
        <input placeholder="Any dates" />
      </div>
      <div className="search-field">
        <label>Travelers</label>
        <input placeholder="2 travelers" />
      </div>
      <button className="search-btn">Search</button>
    </div>

    <div className="grid"></div>
      <div className="grid">
        {trips.map((trip) => (
          <TripCard key={trip._id} trip={trip} />
        ))}
      </div>
    </div>
  );
}

export default BrowseTrips;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Cover.css";

function Cover() {
  const [popularTrips, setPopularTrips] = useState([]);

  useEffect(() => {
    async function fetchPopular() {
      try {
        const response = await axios.get("http://localhost:5000/api/trips");
        const sorted = [...response.data.trips].sort((a, b) => b.joinedCount - a.joinedCount);
        setPopularTrips(sorted.slice(0, 3));
      } catch (err) {
        console.log("Could not load popular trips");
      }
    }
    fetchPopular();
  }, []);

  return (
    <div>
      <section className="hero">
        <span className="eyebrow">Travel together</span>
        <h1>Find your next shared adventure.</h1>
        <p>Discover trips, meet fellow travelers, and make memories that last beyond the journey.</p>
        <div className="hero-buttons">
          <Link to="/trips" className="btn-primary">Browse trips</Link>
          <Link to="/admin/create-trip" className="btn-secondary">Create a trip</Link>
        </div>
      </section>

      <section className="popular">
        <h2>Popular journeys</h2>
        <p className="section-subtext">Fresh picks from the Wanderly community</p>
        <div className="popular-grid">
          {popularTrips.map((trip) => (
            <Link to={`/trips/${trip._id}`} key={trip._id} className="popular-card">
              <div className="popular-image">
                {trip.images?.[0] ? <img src={trip.images[0]} alt={trip.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "Travel photo"}
              </div>
              <p>{trip.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Cover;
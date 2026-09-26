import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Cover.css";

function Cover() {
  const [popularTrips, setPopularTrips] = useState([]);
  const heroImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200",
  "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200",
];
const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;
const slot = Math.floor(Date.now() / FIVE_HOURS_MS);
const currentHeroImage = heroImages[slot % heroImages.length];

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
        <div className="hero-text">
          <span className="eyebrow">Travel together</span>
          <h1>Find your next shared adventure.</h1>
          <p>Discover trips, meet fellow travelers, and make memories that last beyond the journey.</p>
          <div className="hero-buttons">
            <Link to="/trips" className="btn-primary">Browse trips</Link>
            <Link to="/admin/create-trip" className="btn-secondary">Create a trip</Link>
          </div>
        </div>
        <div className="hero-image">
         <img src={currentHeroImage} alt="Travelers on a trip" />
        </div>
      </section>

      <section className="popular">
        <h2>Popular journeys</h2>
        <p className="section-subtext">Fresh picks from the Wanderly community</p>
        <div className="popular-grid">
          {popularTrips.map((trip) => {
            const days = trip.startDate && trip.endDate
              ? Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1
              : "?";
            return (
              <div key={trip._id} className="popular-card">
                <div className="popular-image">
                  {trip.images?.[0] ? <img src={trip.images[0]} alt={trip.title} /> : "Travel photo"}
                </div>
                <div className="popular-card-body">
                  <h3>{trip.title}</h3>
                  <p className="popular-meta">{days} days · {trip.capacity} travelers</p>
                  <p className="popular-price">${trip.pricePerPerson}</p>
                  <Link to={`/trips/${trip._id}`} className="popular-btn">View trip</Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Cover;
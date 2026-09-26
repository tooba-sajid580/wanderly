import { Link } from "react-router-dom";
import "../styles/TripCard.css";
import PriceTag from "./PriceTag";

function TripCard({ trip }) {
  const days = trip.startDate && trip.endDate
    ? Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1
    : "?";

  return (
    <div className="card">
      <div className="card-image">
        {trip.images?.[0] ? <img src={trip.images[0]} alt={trip.title} /> : "Travel photo"}
      </div>
      <div className="card-body">
        <h3>{trip.title}</h3>
        <p className="card-meta">{days} days · {trip.capacity} travelers</p>
        <PriceTag price={trip.pricePerPerson} />
        <Link to={`/trips/${trip._id}`} className="card-btn">View trip</Link>
      </div>
    </div>
  );
}

export default TripCard;
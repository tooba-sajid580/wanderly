import { Link } from "react-router-dom";

function TripCard({ trip }) {
  return (
    <Link to={`/trips/${trip._id}`}>
      <img src={trip.images?.[0]} alt={trip.title} />
      <h3>{trip.title}</h3>
      <p>{trip.category} · {trip.startDate}</p>
      <p>{trip.pricePerPerson}</p>
    </Link>
  );
}

export default TripCard;
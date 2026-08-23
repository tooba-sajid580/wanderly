function TripCard({ trip }) {
  return (
    <div>
      <img src={trip.images?.[0]} alt={trip.title} />
      <h3>{trip.title}</h3>
      <p>{trip.category} · {trip.startDate}</p>
      <p>{trip.pricePerPerson}</p>
    </div>
  );
}
export default TripCard;
function TripDetail() {
  return (
    <div>
      <img src="" alt="" />
      <h2>title</h2>
      <p>destination, dates, category</p>
      <p>spots filled / capacity</p>
      <button>Join trip</button>

      <div>
        <h3>Weather</h3>
        <p>temperature, condition</p>
        <p>recommendation text</p>
      </div>

      <h3>Itinerary</h3>
      <ul>{/* map itinerary days */}</ul>

      <h3>Who's going</h3>
      <div>{/* map member names */}</div>
    </div>
  );
}
export default TripDetail;
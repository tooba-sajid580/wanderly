
function WeatherCard({ weatherInfo }) {
  if (!weatherInfo || !weatherInfo.available) {
    return <p className="weather-pending">Forecast will appear closer to your trip</p>;
  }

  return (
    <div className="weather-card">
      <p className="weather-temp">{weatherInfo.temperature}°C</p>
      <p className="weather-condition">{weatherInfo.condition}</p>
    </div>
  );
}

export default WeatherCard;
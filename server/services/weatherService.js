async function getWeatherForTrip(destination, tripDate) {
  try {
    const daysAway = Math.ceil((new Date(tripDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysAway > 5) {
      return { available: false, message: "Forecast will appear closer to your trip" };
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${destination}&appid=${process.env.WEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    const tripTimestamp = new Date(tripDate).getTime();

    let closestEntry = data.list[0];
    let smallestDifference = Math.abs(new Date(closestEntry.dt_txt).getTime() - tripTimestamp);

    for (const entry of data.list) {
      const entryTimestamp = new Date(entry.dt_txt).getTime();
      const difference = Math.abs(entryTimestamp - tripTimestamp);

      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestEntry = entry;
      }
    }

    return {
      available: true,
      temperature: closestEntry.main.temp,
      condition: closestEntry.weather[0].description,
      lastFetched: new Date(),
    };
  } catch (error) {
    return { available: false, message: "Weather unavailable right now" };
  }
}

module.exports = { getWeatherForTrip };
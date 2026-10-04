async function getWeatherForTrip(destination, tripDate) {
  try {
    if (!destination) {
      return { available: false, message: "No destination set for this trip" };
    }
    if (!tripDate) {
      return { available: false, message: "No start date set for this trip" };
    }

    const tripTimestamp = new Date(tripDate).getTime();
    if (Number.isNaN(tripTimestamp)) {
      return { available: false, message: "Invalid trip date" };
    }

    const daysAway = Math.ceil((tripTimestamp - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysAway < 0) {
      return { available: false, message: "This trip has already started" };
    }
    if (daysAway > 5) {
      return { available: false, message: "Forecast will appear closer to your trip" };
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(destination)}&appid=${process.env.WEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      return { available: false, message: "Weather unavailable for this destination" };
    }

    const data = await response.json();
    if (!Array.isArray(data.list) || data.list.length === 0) {
      return { available: false, message: "Weather unavailable right now" };
    }

    let closestEntry = data.list[0];
    let smallestDifference = Math.abs(closestEntry.dt * 1000 - tripTimestamp);

    for (const entry of data.list) {
      const difference = Math.abs(entry.dt * 1000 - tripTimestamp);
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
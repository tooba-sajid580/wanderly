// Rule-based packing list built from the forecast. No API needed.
function buildPackingList(weather, category) {
  if (!weather || !weather.available) return [];

  const temp = Number(weather.temperature);
  const condition = String(weather.condition || "").toLowerCase();
  const type = String(category || "").toLowerCase();
  const items = [];

  const rainy = /rain|drizzle|shower|thunder/.test(condition);
  const snowy = /snow|sleet/.test(condition);
  const dusty = /dust|sand|haze|smoke/.test(condition);
  const foggy = /mist|fog/.test(condition);
  const clear = /clear/.test(condition);

  // Conditions
  if (rainy) {
    items.push("Umbrella or a light rain jacket");
    items.push("Waterproof cover for your bag and electronics");
  }
  if (snowy) {
    items.push("Waterproof boots");
    items.push("Gloves and a warm hat");
  }
  if (dusty) items.push("Face mask or scarf for dust");
  if (foggy) items.push("Allow extra travel time, visibility may be low");

  // Temperature
  if (!Number.isNaN(temp)) {
    if (temp >= 35) {
      items.push("Water bottle, and drink often");
      items.push("Sunscreen and a hat");
      items.push("Light, breathable clothes");
      items.push("Electrolyte sachets");
    } else if (temp >= 28) {
      items.push("Water bottle");
      items.push("Sunscreen and sunglasses");
    } else if (temp >= 20) {
      items.push("Refillable water bottle");
      if (clear) items.push("Sunglasses and sunscreen");
    } else if (temp >= 10) {
      items.push("Light jacket or sweater");
    } else if (temp >= 0) {
      items.push("Warm jacket");
      items.push("Gloves and a scarf");
    } else {
      items.push("Thermal layers");
      items.push("Insulated jacket, gloves and a warm hat");
    }
  }

  // Trip type
  if (/trek|hik|adventure|mountain|camp/.test(type)) {
    items.push("Sturdy hiking shoes");
  } else if (/cultur|heritage|histor|city|tour/.test(type)) {
    items.push("Comfortable walking shoes");
  } else if (/beach|sea|lake|water/.test(type)) {
    items.push("Swimwear and a towel");
  }

  return [...new Set(items)].slice(0, 6);
}

// Optional one-line tip from Gemini
async function getTripRecommendation(weatherInfo, category) {
  try {
    if (!weatherInfo || !weatherInfo.available) {
      return { available: false, message: "Recommendation will appear once weather is available" };
    }

    const prompt = `Weather: ${weatherInfo.temperature}°C, ${weatherInfo.condition}. Trip type: ${category}. Give one short, practical packing or preparation tip in a single sentence.`;

    const model = process.env.AI_MODEL || "gemini-3.8-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.AI_API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("Gemini request failed:", response.status, details.slice(0, 300));
      return { available: false, message: "Recommendation unavailable right now" };
    }

    const data = await response.json();
    const tipText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!tipText) {
      return { available: false, message: "Recommendation unavailable right now" };
    }

    return {
      available: true,
      text: tipText.trim(),
      lastGenerated: new Date(),
    };
  } catch (error) {
    console.error("Gemini error:", error.message);
    return { available: false, message: "Recommendation unavailable right now" };
  }
}

module.exports = { getTripRecommendation, buildPackingList };
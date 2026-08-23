async function getTripRecommendation(weatherInfo, category) {
  try {
    const prompt = `Weather: ${weatherInfo.temperature}°C, ${weatherInfo.condition}. Trip type: ${category}. Give one short, practical packing or preparation tip in a single sentence.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.AI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    const tipText = data.candidates[0].content.parts[0].text;

    return {
      text: tipText,
      lastGenerated: new Date(),
    };
  } catch (error) {
    return { available: false, message: "Recommendation unavailable right now" };
  }
}

module.exports = { getTripRecommendation };
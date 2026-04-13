import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || 'MISSING_API_KEY',
  baseURL: 'https://api.groq.com/openai/v1',
  dangerouslyAllowBrowser: true
});

export async function fetchEnvironmentalData(latitude = 51.5085, longitude = -0.1257) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&timezone=GMT`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch Open-Meteo');
    return await response.json();
  } catch (error) {
    console.error("Error fetching environmental data:", error);
    throw error;
  }
}

export async function fetchFloodData() {
  // Taking a broad snapshot of UK active flood warnings from the environment API
  const url = `https://environment.data.gov.uk/flood-monitoring/id/floods`;
  try {
    const response = await fetch(url);
    if (!response.ok) return { items: [] };
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching flood data:", error);
    return { items: [] };
  }
}

export async function fetchAdvice() {
  try {
    const response = await fetch('https://api.adviceslip.com/advice');
    const data = await response.json();
    return data.slip.advice;
  } catch (error) {
    return "Stay alert, stay safe.";
  }
}

export async function getSmartResponse(weatherData, floodData) {
  if (!import.meta.env.VITE_GROQ_API_KEY) {
    return {
      threatLevel: 0,
      threatString: "Unknown",
      analysis: "API Key is missing. Please add VITE_GROQ_API_KEY to your .env file."
    };
  }

  // Count active flood warnings
  const activeFloods = floodData?.items?.length || 0;

  const systemPrompt = `You are an expert Environmental Risk Analyzer bot for a Smart Dashboard. 
You will receive raw JSON weather data and the number of active UK flood warnings. Do the following:
1. Assess the current situation (Temperature, Humidity, Wind, Precipitation, Flood Risk).
2. Determine a strict Threat Level from 1 to 4:
   1: Low (🟢)
   2: Moderate (🟡)
   3: High (🔴)
   4: Critical (⚫)
3. Provide an assessment summary paragraph.
4. Then, provide 2-3 concise, actionable steps based on severity. YOU MUST FORMAT THESE AS A BULLETED LIST with each item separated by newlines (\n). Do not put them all on one line.
5. Output strictly in JSON format as follows:
{
  "threatLevel": <number 1-4>,
  "threatString": "<Low, Moderate, High, or Critical>",
  "analysis": "<String with assessment paragraph. Followed by two newlines. Followed by bulleted list of actionable steps.>"
}`;

  const userPrompt = `Raw Environmental Data: ${JSON.stringify(weatherData?.current || {})} | Active Flood Warnings in Region: ${activeFloods}`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0]?.message?.content);
    return result;
  } catch (error) {
    console.error("Error fetching from Groq:", error);
    return {
      threatLevel: 0,
      threatString: "Error",
      analysis: `Error generating smart response: ${error.message}`
    };
  }
}

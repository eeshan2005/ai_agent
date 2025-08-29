import { config } from "dotenv";
import { getWeather } from "./weather.tool.js";
import { getNews } from "./news.tool.js";
config();

// Function to get a morning briefing combining multiple data sources
export async function getMorningBriefing(location = 'New York', newsCountry = 'us') {
    try {
        // Get weather information
        const weatherResponse = await getWeather(location);
        const weatherText = weatherResponse.content[0].text;
        
        // Get top news headlines
        const newsResponse = await getNews('general', newsCountry);
        const newsText = newsResponse.content[0].text;
        
        // Combine the information into a morning briefing
        const briefingText = `🌞 GOOD MORNING BRIEFING 🌞\n\n` +
                           `🌤️ WEATHER:\n${weatherText}\n\n` +
                           `📰 TOP HEADLINES:\n${newsText.split('\n\n')[1]}`;
        
        return {
            content: [
                {
                    type: "text",
                    text: briefingText
                }
            ]
        };
    } catch (error) {
        console.error("Error creating morning briefing:", error);
        return {
            content: [
                {
                    type: "text",
                    text: `Error creating morning briefing: ${error.message}`
                }
            ]
        };
    }
}
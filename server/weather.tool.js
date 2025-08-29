import { config } from "dotenv";
config();

// Function to get weather data from OpenWeatherMap API
export async function getWeather(location) {
    try {
        // Using OpenWeatherMap API
        const apiKey = process.env.OPENWEATHER_API_KEY || "YOUR_API_KEY_HERE";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format the weather data
        const weatherInfo = {
            location: data.name,
            country: data.sys.country,
            temperature: data.main.temp,
            feelsLike: data.main.feels_like,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            icon: data.weather[0].icon
        };
        
        return {
            content: [
                {
                    type: "text",
                    text: `Weather in ${weatherInfo.location}, ${weatherInfo.country}: ${weatherInfo.temperature}°C, ${weatherInfo.description}. Humidity: ${weatherInfo.humidity}%, Wind: ${weatherInfo.windSpeed} m/s`
                }
            ]
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching weather data: ${error.message}`
                }
            ]
        };
    }
}
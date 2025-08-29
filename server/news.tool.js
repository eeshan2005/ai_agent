import { config } from "dotenv";
config();

// Function to get news headlines from NewsAPI
export async function getNews(topic = 'general', country = 'us') {
    try {
        // Using NewsAPI
        const apiKey = process.env.NEWSAPI_KEY || "YOUR_API_KEY_HERE";
        const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${topic}&apiKey=${apiKey}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`News API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format the news data
        if (data.articles && data.articles.length > 0) {
            // Get top 5 articles or fewer if less are available
            const topArticles = data.articles.slice(0, 5);
            
            // Format the articles into a readable text
            const newsText = topArticles.map((article, index) => {
                return `${index + 1}. ${article.title} - ${article.source.name}\n   ${article.description || 'No description available'}\n`;
            }).join('\n');
            
            return {
                content: [
                    {
                        type: "text",
                        text: `Top headlines for ${topic} in ${country.toUpperCase()}:\n\n${newsText}`
                    }
                ]
            };
        } else {
            return {
                content: [
                    {
                        type: "text",
                        text: `No news articles found for ${topic} in ${country.toUpperCase()}.`
                    }
                ]
            };
        }
    } catch (error) {
        console.error("Error fetching news data:", error);
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching news data: ${error.message}`
                }
            ]
        };
    }
}
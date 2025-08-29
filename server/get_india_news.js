import { config } from "dotenv";
import fetch from "node-fetch";

config();

async function getIndiaNews() {
    try {
        // Using NewsAPI with everything endpoint
        const apiKey = process.env.NEWSAPI_KEY;
        
        // Using 'everything' endpoint with 'India' as a query
        const url = `https://newsapi.org/v2/everything?q=India&language=en&sortBy=publishedAt&apiKey=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.status !== 200) {
            console.error("Error from NewsAPI:", data.message || "Unknown error");
            return;
        }
        
        if (data.articles && data.articles.length > 0) {
            // Get top 10 articles
            const topArticles = data.articles.slice(0, 10);
            
            console.log("\n==================================================");
            console.log("📰 TODAY'S LATEST NEWS FROM INDIA");
            console.log("==================================================\n");
            
            // Format the articles into a readable text
            topArticles.forEach((article, index) => {
                console.log(`${index + 1}. ${article.title}`);
                console.log(`   Source: ${article.source.name}`);
                if (article.description) {
                    console.log(`   ${article.description}`);
                }
                console.log(`   Published: ${new Date(article.publishedAt).toLocaleString()}`);
                if (article.url) {
                    console.log(`   Read more: ${article.url}`);
                }
                console.log("\n---------------------------------------------------\n");
            });
        } else {
            console.log("No news articles found about India.");
        }
    } catch (error) {
        console.error("Error fetching news data:", error);
    }
}

// Run the function
getIndiaNews();
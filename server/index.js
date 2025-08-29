import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createPost } from "./mcp.tool.js";
import { getWeather } from "./weather.tool.js";
import { getNews } from "./news.tool.js";
import { getMorningBriefing } from "./briefing.tool.js";
import { listFiles, readFile, writeFile } from "./filesystem.tool.js";
import { z } from "zod";

const server = new McpServer({
    name: "example-server",
    version: "1.0.0"
});

// ... set up server resources, tools, and prompts ...

const app = express();

server.tool(
    "addTwoNumbers",
    "Add two numbers",
    {
        a: z.number(),
        b: z.number()
    },
    async (arg) => {
        const { a, b } = arg;
        return {
            content: [
                {
                    type: "text",
                    text: `The sum of ${a} and ${b} is ${a + b}`
                }
            ]
        }
    }
)

server.tool(
    "createPost",
    "Create a post on X formally known as Twitter ", {
    status: z.string()
}, async (arg) => {
    const { status } = arg;
    return createPost(status);
})

server.tool(
    "getWeather",
    "Get current weather information for a location", {
    location: z.string().describe("The city name or location to get weather for")
}, async (arg) => {
    const { location } = arg;
    return getWeather(location);
})

server.tool(
    "getNews",
    "Get top news headlines by topic and country", {
    topic: z.string().default("general").describe("The news topic/category (e.g., general, business, technology, sports, entertainment, health, science)"),
    country: z.string().default("us").describe("The country code (e.g., us, gb, in, au)")
}, async (arg) => {
    const { topic, country } = arg;
    return getNews(topic, country);
})

server.tool(
    "getMorningBriefing",
    "Get a morning briefing with weather and news", {
    location: z.string().default("New York").describe("The city name or location to get weather for"),
    newsCountry: z.string().default("us").describe("The country code for news (e.g., us, gb, in, au)")
}, async (arg) => {
    const { location, newsCountry } = arg;
    return getMorningBriefing(location, newsCountry);
})

// File system operation tools
server.tool(
    "listFiles",
    "List files in a directory", {
    dirPath: z.string().optional().describe("The directory path relative to the base directory")
}, async (arg) => {
    const { dirPath } = arg;
    return listFiles(dirPath);
})

server.tool(
    "readFile",
    "Read the contents of a file", {
    filePath: z.string().describe("The file path relative to the base directory")
}, async (arg) => {
    const { filePath } = arg;
    return readFile(filePath);
})

server.tool(
    "writeFile",
    "Write content to a file", {
    filePath: z.string().describe("The file path relative to the base directory"),
    content: z.string().describe("The content to write to the file")
}, async (arg) => {
    const { filePath, content } = arg;
    return writeFile(filePath, content);
})


// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
const transports = {};

app.get("/sse", async (req, res) => {
    const transport = new SSEServerTransport('/messages', res);
    transports[ transport.sessionId ] = transport;
    res.on("close", () => {
        delete transports[ transport.sessionId ];
    });
    await server.connect(transport);
});

app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId;
    const transport = transports[ sessionId ];
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send('No transport found for sessionId');
    }
});

app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});
# Enhanced AI Agent

This project is an AI agent built with Model Context Protocol (MCP) that can perform various tasks using tools. It consists of a server and a client component.

## Features

### Core Functionality
- **Tool-based Architecture**: The agent uses a tool-based approach where each capability is implemented as a separate tool.
- **Real-time Communication**: Uses Server-Sent Events (SSE) for real-time communication between client and server.
- **Gemini Integration**: Leverages Google's Gemini AI model for natural language understanding and generation.

### Available Tools

#### Basic Tools
- **addTwoNumbers**: A simple tool that adds two numbers and returns the result.
- **createPost**: Creates a post on Twitter (X) using the Twitter API.

#### News Tool
- **getNews**: Retrieves top news headlines by topic and country using NewsAPI (integrated directly into the client).

#### File System Operations
- **listFiles**: Lists files in a specified directory.
- **readFile**: Reads the contents of a file.
- **writeFile**: Writes content to a file.

### Enhanced Client
- **Rich Component Rendering**: Displays tool results in a formatted, visually appealing way.
- **Suggested Prompts**: Provides users with example prompts to help them get started.
- **Interactive Commands**: Supports commands like 'help', 'exit', and 'quit'.

## Setup

### Prerequisites
- Node.js (v14 or higher)
- API keys for:
  - Google Gemini API
  - NewsAPI

### Installation

1. Clone the repository
2. Install dependencies in both `server` and `client` directories:
   ```bash
   cd server
   npm install
   cd ../client
   npm install
   ```

3. Configure API keys:
   - Create/update `.env` files in both `server` and `client` directories with your API keys.

### Running the Application

1. Start the server:
   ```bash
   cd server
   npm start
   ```

2. In a separate terminal, start the client:
   ```bash
   cd client
   npm start
   ```

## Usage

Once both the server and client are running, you can interact with the AI agent through the command line interface. Here are some example prompts:

- "What's the weather in Mumbai?"
- "Show me the latest news."
- "Give me my morning briefing for New York."
- "Add 42 and 17."
- "Post a tweet saying hello world."
- "List files in the data directory."
- "Write a note to my_notes.txt."

Type 'help' to see suggested prompts, and 'exit' or 'quit' to end the session.

## Extending the Agent

To add new tools:

1. Create a new tool implementation file in the server directory
2. Import and register the tool in `server/index.js`
3. Update the client's rich component rendering function to handle the new tool's output

## License

ISC
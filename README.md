# Sushibot

### Introduction to the Sushi Ordering Chatbot Project

This project involves the development of an interactive chatbot designed to make it easier for customers to order sushi through a friendly and efficient interface. The chatbot is equipped to display the day's menu, take orders, and answer frequently asked questions such as business hours and menu details.

The chatbot's back-end is built with Node.js, leveraging the capabilities of JavaScript on the server to handle user interactions asynchronously. Data persistence, such as products and orders, is managed through MongoDB, a NoSQL database that offers flexibility and straightforward integration with Node.js.

For the user interface, React is used, a JavaScript framework for building user interfaces with reusable and reactive components. This allows for a smooth and dynamic user experience, where orders and interactions are updated in real-time.

### Server (Express + Typescript + MongoDB)

#### Environment Variables

Before running the server project, ensure the following environment variables are set:

- `PORT`: The port number where the server will listen.
- `OPENAI_API_KEY`: Your API key for OpenAI services.
- `MONGODB_URL`: Your MongoDB connection string.

#### Installation

Navigate to the server directory and install dependencies:

```bash
npm install
```

#### Running the Project

Start the server with:

```bash
npm run dev
```

The server will be accessible at `http://localhost:<PORT>`.

#### MongoDB Connection

Set the `MONGODB_URL` environment variable with your MongoDB connection string. The server uses Mongoose for MongoDB interactions, as seen in the `MongoDBClient` class (startLine: 1, endLine: 12).

For detailed MongoDB setup instructions, refer to the [official MongoDB documentation](https://www.mongodb.com/docs/manual/).

### Client (React + Vite.js + Typescript)

#### Environment Variables

The client project requires the `SERVER_API_URL` environment variable to connect to the server via WebSocket.

#### Installation

Navigate to the client directory and install dependencies:

```bash
npm install
```

#### Running the Project

Start the client with:

```bash
npm run dev
```

The client will be accessible at `http://localhost:5173`.

#### MongoDB Connection

The client interacts with the server via WebSocket, which handles MongoDB operations.

For MongoDB setup, refer to the [official MongoDB documentation](https://www.mongodb.com/docs/manual/).

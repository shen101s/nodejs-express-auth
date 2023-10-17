# nodejs-express-auth API with Mongoose

This is a starter template for building a Node.js API using Express and Mongoose. It provides a basic structure for creating and managing RESTful routes and interacting with a MongoDB database.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- MongoDB installed locally or a remote MongoDB database connection.

## Getting Started

1. Clone the repository
2. Change into the project directory:
   cd node-express-proj
3. Install the project dependencies:
  npm install
4. Rename the .env.dev to .env file in the project root and configure your database connection
5. Start the server:
   npm run dev

## Project Structure

- app.js: The main application file where Express is configured.
- models/: Define your Mongoose models here.
- routes/: Define your API routes and controllers.
- controllers/: Implement the route handlers.
- middleware/: Custom middleware functions.
- public/: Static files.
- views/: Template views (ejs).

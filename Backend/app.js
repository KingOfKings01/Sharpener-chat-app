import 'dotenv/config'
import http from 'http'
import express from 'express'
import cors from 'cors'
import userRouters from './routes/userRouters.js'
import sequelize from "./config/database.js"

const app = express()
app.use(cors(
    {
        origin: 'http://localhost:5173',
        methods: 'GET, POST, PUT, DELETE',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Authorization']  // Expose Authorization header for CORS requests
    }
))
app.use(express.json());

// Routes
app.use("/user", userRouters);

const port = process.env.PORT || 3000;

// Database Sync
async function initializeDatabase() {
    await sequelize.sync({ force: false });
  }
    initializeDatabase();

const server = http.createServer(app) 

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import userRouters from "./routes/userRouters.js";
import groupRouters from "./routes/groupRouters.js";
import sequelize from "./config/database.js";
import setupAssociations from "./models/associations.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"], // Expose Authorization header for CORS requests
  })
);
app.use(express.json());

// Routes
app.use("/user", userRouters);
app.use("/group", groupRouters);

// Setup associations
setupAssociations();

// Database Sync
async function initializeDatabase() {
  await sequelize.sync({ force: false });
}
initializeDatabase();

const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

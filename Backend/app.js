import "dotenv/config";
import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import userRouters from "./routes/userRouters.js";
import groupRouters from "./routes/groupRouters.js";
import sequelize from "./config/database.js";
import setupAssociations from "./models/associations.js";
import socketAuthMiddleware from "./middleware/socketAuth.js";
import socketHandlers from "./sockets/socketHandlers.js"; 

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Setup associations
setupAssociations();

const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Apply Socket.IO authentication middleware
io.use(socketAuthMiddleware);

// Attach Socket.IO handlers
socketHandlers(io);  // This function will be invoked to handle socket events

app.use((req, res, next) => {
  req.io = io;  // Attach the Socket.IO instance to the request object if needed
  next();
});

// Routes
app.use("/user", userRouters);
app.use("/group", groupRouters);

// Database Sync
async function initializeDatabase() {
  await sequelize.sync({ force: false });
}
initializeDatabase();

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

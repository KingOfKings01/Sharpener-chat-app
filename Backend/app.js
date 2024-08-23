import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import userRouters from './routes/userRouters.js'
import sequelize from "./config/database.js"

const app = express()
app.use(cors())
app.use(express.json());

// Routes
app.use("/user", userRouters);

const port = process.env.PORT || 3000;


// Database Sync
async function initializeDatabase() {
    await sequelize.sync({ force: false });
  }
  
  initializeDatabase();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
import 'dotenv/config'
import express from 'express'
import cros from 'cros'

// Render .env file
config()

const app = express()
app.use(cros())

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
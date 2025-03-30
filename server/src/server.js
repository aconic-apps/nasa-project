const https = require("https");
const fs = require("fs");

const app = require("./app");

require("dotenv").config();

const { loadPlanetsData } = require("./models/planets.model");
const { mongoConnect } = require("../utils/mongo");
const { loadLaunchesData } = require("./models/launches.model");

const PORT = process.env.PORT || 2000;

const server = https.createServer(
  {
    cert: fs.readFileSync("certificate.pem"),
    key: fs.readFileSync("private-key.pem"),
  },
  app
);

async function startServer() {
  await mongoConnect();

  await loadPlanetsData();

  await loadLaunchesData();

  server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

startServer();

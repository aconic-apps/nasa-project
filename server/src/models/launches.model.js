const launches = require("./launches.mongo");

const planets = require("./planets.mongo");

const axios = require("axios");

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function loadLaunchesData() {
  const response = await axios.post(
    "https://api.spacexdata.com/v4/launches/query",
    {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: "rocket",
            select: {
              name: 1,
            },
          },
          {
            path: "payloads",
            select: {
              customers: 1,
            },
          },
        ],
      },
    }
  );

  response.data.docs.forEach(async (doc) => {
    const _launch = {
      flightNumber: doc.flight_number,
      mission: doc.name,
      rocket: doc.rocket.name,
      launchDate: doc.date_local,
      target: doc.target || "Unkown",
      customers: doc.payloads
        .flatMap((payload) => payload.customers)
        .concat(["ZTM", "NASA"]),
      upcoming: doc.upcoming,
      success: doc.success,
    };

    await saveLaunch(_launch);
  });
}

async function getAllLaunches(skip, limit) {
  return await launches
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort("-flightNumber");

  return latestLaunch?.flightNumber || 100;
}

async function scheduleNewLaunch(launch) {
  const latestFlightNumber = await getLatestFlightNumber();

  const newLaunch = {
    ...launch,
    flightNumber: latestFlightNumber + 1,
    customers: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
  };

  const hasMatchingPlanet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!hasMatchingPlanet) {
    throw new Error("No matching planet found");
  }

  await saveLaunch(newLaunch);
}

async function saveLaunch(launch) {
  return await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne(
    { flightNumber: launchId },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
  saveLaunch,
  loadLaunchesData,
};

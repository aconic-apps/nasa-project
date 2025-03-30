const { getPagination } = require("../../../utils/query");
const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);

  return res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  const _body = {
    ...launch,
    launchDate: launch.launchDate && new Date(launch.launchDate),
  };

  if (!_body.mission || !_body.rocket || !_body.launchDate || !_body.target) {
    return res.status(400).json({
      error: "Missing required launch properties",
    });
  }

  if (_body.launchDate.toString() === "Invalid Date") {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  await scheduleNewLaunch(_body);

  return res.status(201).json(_body);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  const existsLaunch = await existsLaunchWithId(launchId);

  if (!existsLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const abortedLaunch = await abortLaunchById(launchId);

  if (!abortedLaunch) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }

  return res.status(200).json({
    ok: true,
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};

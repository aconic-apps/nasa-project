const BASE_URL = "https://localhost:2000/v1";

async function httpGetPlanets() {
  const response = await fetch(`${BASE_URL}/planets`);

  const res = await response.json();

  return res;
}

async function httpGetLaunches() {
  const response = await fetch(`${BASE_URL}/launches`);

  const res = await response.json();

  return res;
}

async function httpSubmitLaunch(launch) {
  try {
    const response = await fetch(`${BASE_URL}/launches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });

    return response;
  } catch (error) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    const response = await fetch(`${BASE_URL}/launches/${id}`, {
      method: "DELETE",
    });

    return response;
  } catch (error) {
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };

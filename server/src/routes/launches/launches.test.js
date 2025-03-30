const request = require("supertest");

const app = require("../../app");

const { mongoConnect, mongoDisconnect } = require("../../../utils/mongo");

app.use((req, res, next) => {
  req.user = {
    id: "test123",
    email: "test@example.com",
  };
  req.isAuthenticated = () => true;
  next();
});

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("GET /launches", () => {
    test("It should respond with 200 success status", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("POST /launches", () => {
    const launch = {
      mission: "Kepler Exploration Y",
      rocket: "Explorer IS1",
      launchDate: "December 27, 2028",
      target: "Kepler-442 b",
    };

    const launchDataWithoutDate = {
      mission: "Kepler Exploration Y",
      rocket: "Explorer IS1",
      target: "Kepler-442 b",
    };

    const launchDataWithInvalidDate = {
      mission: "Kepler Exploration Y",
      rocket: "Explorer IS1",
      target: "Kepler-442 b",
      launchDate: "wrongdate",
    };

    test("It should respond with 201 created status", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launch)
        .expect(201)
        .expect("Content-Type", /json/);

      const requestDate = new Date(launch.launchDate).toISOString();

      const responseDate = response.body.launchDate;

      expect(response.body).toMatchObject(launchDataWithoutDate);

      expect(requestDate).toBe(responseDate);
    }, 10000);

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body).toStrictEqual({
        error: "Missing required launch properties",
      });
    });

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});

const express = require("express");

const path = require("path");
const helmet = require("helmet");
const cookieSession = require("cookie-session");
const cors = require("cors");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");

require("dotenv").config();

const AUTH_OPTIONS = {
  callbackURL: "/v1/auth/google/callback",
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

const morgan = require("morgan");

const v1Router = require("./APIVersions/v1");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://accounts.google.com",
      "https://oauth2.googleapis.com",
      "https://accounts.google.com",
    ],
    credentials: true,
  })
);

app.use(morgan("combined"));

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(express.json());

function verifyCallback(accessToken, refreshToken, profile, done) {
  done(null, profile);
}

app.use(helmet());

app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2],
  })
);

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

// Save the user in the session/cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Read the user from the session/cookie
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use(passport.initialize());

app.use(passport.session());

app.use("/v1", v1Router);

app.get(
  "/v1/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

app.get(
  "/v1/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    session: true,
  })
);

app.get("/v1/auth/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/failure", (req, res) => {
  res.send("Failed to log in");
});

app.use("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;

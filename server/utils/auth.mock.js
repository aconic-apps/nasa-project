const passport = {
  authenticate: () => (req, res, next) => next(),
  initialize: () => (req, res, next) => next(),
  session: () => (req, res, next) => {
    req.user = {
      id: "test123",
      email: "test@example.com",
    };
    req.isAuthenticated = () => true;
    next();
  },
};

module.exports = passport;

const checkAuth = (req, res, next) => {
  const isLoggedIn = req.isAuthenticated() && req.user;

  if (!isLoggedIn) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  next();
};

const mockAuth = (req, res, next) => {
  // Mock authenticated user
  req.user = "test123";
  next();
};

module.exports = { checkAuth, mockAuth };

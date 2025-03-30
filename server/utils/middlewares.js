const checkAuth = (req, res, next) => {
  const isLoggedIn = req.isAuthenticated() && req.user;

  if (!isLoggedIn) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  next();
};

module.exports = { checkAuth };

function notFound(req, res, next) {
  res.status(404).json({
    message: "Route not found"
  });
}

module.exports = notFound;
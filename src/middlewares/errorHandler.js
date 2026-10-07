function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route introuvable : ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(err, req, res,next) {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Erreur interne du serveur",
  });
}

module.exports = { notFound, errorHandler };
function errorMiddleware(err, req, res, next) {
  const status_code = err.statusCode || 500;
  const errorMessage = err.message || "Internal Server Error";

  return res
    .status(status_code)
    .json({ status_code, status: "failed", message: errorMessage });
}

export default errorMiddleware;

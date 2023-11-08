export default function errorHandler(status_code, message) {
  const error = new Error();
  error.statusCode = status_code || 500;
  error.message = message || "Internal Server Error";
  return error;
}

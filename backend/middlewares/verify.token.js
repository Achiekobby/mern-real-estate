import errorHandler from "../helpers/error.handler.js";
import jwt from "jsonwebtoken";

export const verify_token = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(
      errorHandler(401, "You must be authenticated to access this resource")
    );
  }
  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) return next(errorHandler(401, "Forbidden operation"));
    req.user = user;
    next();
  });
};

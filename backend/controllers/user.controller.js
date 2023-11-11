import { Router } from "express";
import validationMiddleware from "../middlewares/validation.middleware.js";
import validate from "../validators/user.validation.js";
import User from "./../models/UserModel.js";
import bcrypt from "bcryptjs";
import errorHandler from "./../helpers/error.handler.js";
import jwt from "jsonwebtoken";

class UserController {
  router = Router();
  path = "/auth";

  constructor() {
    this.initializeUserRoutes();
  }

  initializeUserRoutes() {
    //* User SingUp Route
    this.router.post(
      `${this.path}/sign-up`,
      validationMiddleware(validate.register),
      this.register
    );

    //* User Login Route
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.login),
      this.login
    );
  }

  async register(req, res, next) {
    try {
      const { first_name, last_name, email, password, phone_number } = req.body;
      //* hashing the password
      const hashed_password = bcrypt.hashSync(password, 10);

      //* creating a new user in the DB.
      const new_user = await new User({
        first_name,
        last_name,
        email,
        password: hashed_password,
        phone_number,
      });
      await new_user.save();
      res
        .status(201)
        .json({ status: "success", message: "User created successfully" });
    } catch (error) {
      next(error);
    }
  }

  //Todo => Sign in a user
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return next(errorHandler(404, "User not found"));
      }
      //* checking the password
      const valid_password = bcrypt.compareSync(password, user.password);
      if (!valid_password) {
        return next(errorHandler(401, "Incorrect Credentials"));
      }

      //* building a token for the logged in user
      const token = jwt.sign(
        { id: user._id, email: user.email, uuid: user.uuid },
        process.env.JWT_SECRET
      );

      //* saving token as a cookie and returning the details of the user
      const { password: pass, uuid: uuid, ...user_info } = user._doc;

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({ status: "success", user_info });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;

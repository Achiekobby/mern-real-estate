import { Router } from "express";
import validationMiddleware from "../middlewares/validation.middleware.js";
import validate from "../validators/user.validation.js";
import User from "./../models/UserModel.js";
import bcrypt from "bcryptjs";

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
  }

  async register(req, res) {
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
      res.status(500).json({ message: error.message });
    }
  }
}

export default UserController;

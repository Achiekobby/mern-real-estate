import { Router } from "express";
import validationMiddleware from "../middlewares/validation.middleware.js";
import validate from "../validators/user.validation.js";
import User from "./../models/UserModel.js";
import bcrypt from "bcryptjs";
import errorHandler from "./../helpers/error.handler.js";
import jwt from "jsonwebtoken";
import { verify_token } from "../middlewares/verify.token.js";

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

    //* User google Login
    this.router.post(`${this.path}/google`, this.google_login);

    //*update the user details in the database
    this.router.post(
      `${this.path}/user/update/:id`,
      verify_token,
      this.update_user_details
    );

    //* delete user api route
    this.router.delete(
      `${this.path}/user/delete/:id`,
      verify_token,
      this.delete_user_account
    );

    //* Sign out route
    this.router.get(`${this.path}/user/sign-out`, verify_token, this.sign_out);
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

  //Todo => Google Sign in
  async google_login(req, res, next) {
    try {
      const { email, first_name, last_name, photo_url } = req.body;
      //* check if the user already exist in our database
      const user = await User.findOne({ email });
      if (user) {
        //* create a token a store inside a cookie
        const token = jwt.sign(
          { id: user._id, email: user.email, uuid: user.uuid },
          process.env.JWT_SECRET
        );
        //* making sure password is not passed along with the return user data
        const { password: pass, uuid: uuid, ...user_info } = user._doc;

        res
          .cookie("access_token", token, { httpOnly: true })
          .status(200)
          .json({ user_info });
      } else {
        //! THIS MEANS THE PERSON IS NOT IN THE SYSTEM
        //* generate a password
        const password =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);

        //* hash the password
        const hashed_password = bcrypt.hashSync(password, 10);

        //* generating a generic phone number for the user
        const random_phone_number = "+233230000000";

        //* create a new user
        const new_user = new User({
          first_name,
          last_name,
          email,
          password: hashed_password,
          phone_number: random_phone_number,
          avatar: photo_url,
        });
        await new_user.save();

        //* create a token for the user
        const token = jwt.sign(
          { id: new_user._id, email: new_user.email, uuid: new_user.uuid },
          process.env.JWT_SECRET
        );

        const { password: pass, uuid: uuid, ...user_info } = new_user._doc;
        res
          .cookie("access_token", token, { httpOnly: true })
          .status(201)
          .json({ user_info });
      }
    } catch (error) {
      next(error);
    }
  }

  //Todo => This api allows the user to update their details including the password
  async update_user_details(req, res, next) {
    try {
      const id = req.params.id;
      if (req.user.id !== id) {
        next(
          errorHandler(
            401,
            "You are not allowed to edit another person's account"
          )
        );
      }

      if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
      }
      const updated_user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            phone_number: req.body.phone_number,
            avatar: req.body.avatar,
          },
        },
        { new: true }
      );

      const { password: pass, uuid: uuid, ...user_info } = updated_user._doc;
      res.status(200).json({ user_info });
    } catch (error) {
      next(error);
    }
  }

  //Todo => User Delete Account Functionality
  async delete_user_account(req, res, next) {
    try {
      const id = req.params.id;
      if (id !== req.user.id) {
        next(errorHandler(401, "You are not allowed to delete this account"));
      }
      //* perform the deletion
      await User.findByIdAndDelete(id);
      res
        .status(200)
        .json({
          status: "success",
          message: "Successfully removed your account",
        })
        .clearCookie("access_token");
    } catch (error) {
      next(error);
    }
  }

  //Todo => Sign out functionality
  async sign_out(req, res, next) {
    try {
      res.clearCookie("access_token");
      res
        .status(200)
        .json({ status: "success", message: "User has logged out" });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;

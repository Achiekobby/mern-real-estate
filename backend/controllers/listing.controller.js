import { Router } from "express";
import { verify_token } from "../middlewares/verify.token.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { listing_validation } from "../validators/listing.validation.js";
import Listing from "../models/ListingModel.js";
import errorHandler from "../helpers/error.handler.js";

class ListingController {
  router = Router();
  path = "/listing";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    //* creating a new listing
    this.router.post(
      `${this.path}/create`,
      verify_token,
      validationMiddleware(listing_validation),
      this.create_listing
    );

    //* extracting all the user listings
    this.router.get(
      `/user${this.path}/:id`,
      verify_token,
      this.get_user_listings
    );
  }

  async create_listing(req, res, next) {
    try {
      const new_listing = await Listing.create(req.body);
      if (new_listing) {
        const { uuid: uuid, ...listing } = new_listing._doc;
        return res.status(201).json({ status: "success", listing: listing });
      }
    } catch (error) {
      next(error);
    }
  }

  async get_user_listings(req, res, next) {
    try {
      if (req.user.id === req.params.id) {
        const listings = await Listing.find({ user_ref: req.params.id }).select(
          "-uuid"
        );
        if (listings && listings.length >0) {
          return res.status(200).json({ status: "success", listings });
        }
        else{
          next(errorHandler(404, "You have not listed anything yet!!"))
        }
      }
      next(errorHandler(400, "You can only view your own listings"));
    } catch (error) {
      next(errorHandler(500, error.message));
    }
  }
}

export default ListingController;

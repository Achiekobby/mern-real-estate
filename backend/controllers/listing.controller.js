import { Router } from "express";
import { verify_token } from "../middlewares/verify.token.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { listing_validation } from "../validators/listing.validation.js";
import Listing from "../models/ListingModel.js";


class ListingController {
  router = Router();
  path = "/listing";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    //* creating a new listing
    this.router.post(`${this.path}/create`, verify_token, validationMiddleware(listing_validation), this.create_listing);
  }

  async create_listing(req, res, next) {
    try {
      const new_listing = await Listing.create(req.body);
      if(new_listing){
        const {uuid:uuid, ...listing} = new_listing._doc
        return res.status(201).json({status:"success", listing:listing})
      }
    } catch (error) {
      next(error);
    }
  }
}

export default ListingController;

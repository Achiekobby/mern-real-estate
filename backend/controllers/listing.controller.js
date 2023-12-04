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

    //* show the details of a specific listing
    this.router.get(
      `/user${this.path}/show/:listing_id`,
      verify_token,
      this.show_listing
    );

    //* Route for updating the details of a listing
    this.router.post(
      `/user${this.path}/update/:listing_id`,
      verify_token,
      this.update_listing
    );

    this.router.delete(
      `/user${this.path}/:listing_id`,
      verify_token,
      this.remove_listing
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
        if (listings && listings.length > 0) {
          return res.status(200).json({ status: "success", listings });
        } else {
          next(errorHandler(404, "You have not listed anything yet!!"));
        }
      }
      next(errorHandler(400, "You can only view your own listings"));
    } catch (error) {
      next(errorHandler(500, error.message));
    }
  }

  async remove_listing(req, res, next) {
    try {
      const id = req.params.listing_id;
      //* find the listing to be removed
      const listing = await Listing.findById(id);
      if (!listing) {
        return res.status(404).json({
          status: "failed",
          message:
            "The listing specified could not be found. Please try again with the correct parameters",
        });
      }

      //*check if the listing belongs to the signed in user
      if (req.user.id !== listing.user_ref) {
        return res.status(400).json({
          status: "failed",
          message:
            "You must be the owner of this listing to be able to delete it",
        });
      }

      //* Proceeding with the delete process
      await Listing.deleteOne({ _id: id });
      return res.status(200).json({
        status: "success",
        message: "Great, Listing has been removed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  //Todo => API to allow the users update the details of a listing
  async update_listing(req, res, next) {
    const listing = await Listing.findById(req.params.listing_id);
    if (!listing) {
      return next(errorHandler(404, "Listing could not be found"));
    }
    if (req.user.id !== listing.user_ref) {
      return next(errorHandler(401, "You can only edit your own listing"));
    }

    try {
      const updated_listing = await Listing.findByIdAndUpdate(
        req.params.listing_id,
        req.body,
        { new: true }
      );
      const { uuid: uuid, ...listing } = updated_listing._doc;
      return res.status(200).json({ status: "success", listing });
    } catch (error) {
      next(error);
    }
  }

  //Todo => API to retrieve the details of a specified listing
  async show_listing(req, res, next) {
    try {
      const listing_details = await Listing.findById(req.params.listing_id);
      if (!listing_details) {
        return next(errorHandler(404, "Listing could not be found"));
      }
      if (req.user.id !== listing_details.user_ref) {
        return next(errorHandler(401, "You can only edit your own listing"));
      }
      const { uuid: uuid, ...listing } = listing_details._doc;
      return res.status(200).json({ status: "success", listing });
    } catch (error) {
      next(error);
    }
  }
}

export default ListingController;

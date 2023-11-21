import mongoose from "mongoose";
import { randomUUID } from "crypto";

const listing_schema = mongoose.Schema(
  {
    uuid: {
      type: "UUID",
      default: () => randomUUID(),
    },

    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regular_price: {
      type: String,
      required: true,

    },
    discount_price: {
      type: String,
      required: true,
    },
    bath_rooms: {
      type: Number,
      required: true,
    },
    bed_rooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["rent", "sale"],
    },
    offer: {
      type: Boolean,
      required: true,
    },
    image_urls: {
      type: Array,
      required: true,
    },
    user_ref: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listing_schema);

export default Listing;

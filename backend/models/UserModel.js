import mongoose from "mongoose";
import { randomUUID } from "crypto";

//* creating the schema
const user_schema = mongoose.Schema(
  {
    uuid: {
      type: "UUID",
      default: () => randomUUID(),
    },
    first_name: {
      type: String,
      required: true,
      max: 255,
    },
    last_name: {
      type: String,
      required: true,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
    },
    phone_number: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    avatar:{
      type:String,
      default:"https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg"
    }
  },
  { timestamps: true }
);

//* creating a model for the schema implemented above
const User = mongoose.model("User", user_schema);

export default User;
//* import the app
import App from "./app.js";
import dotenv from "dotenv";
import UserController from "./controllers/user.controller.js";
import ListingController from "./controllers/listing.controller.js";

dotenv.config();
const db_uri = process.env.DB_ONLINE_CONNECTION;
const app = new App([new UserController(), new ListingController()], db_uri);

app.listen();

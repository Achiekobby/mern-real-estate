//* import the app
import App from "./app.js";
import dotenv from "dotenv";
import UserController from "./controllers/user.controller.js";

dotenv.config();
const db_uri = process.env.DB_CONNECTION_URL;
const app = new App([new UserController()], db_uri);
app.listen();

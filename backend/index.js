//* import the app
import App from "./app.js";
import dotenv from "dotenv";

dotenv.config();
const db_uri = process.env.DB_CONNECTION_URL;
const app = new App([], db_uri);
app.listen();

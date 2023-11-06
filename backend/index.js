import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();

//* method to start server
function start_server() {
  const port = process.env.PORT_NUMBER;
  app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
  });
}

//* database connection
const mongo_url = process.env.DB_CONNECTION_URL;
mongoose
  .connect(mongo_url)
  .then(() => {
    console.log("Database connection established");
    start_server();
  })
  .catch((err) => {
    console.log(err.message);
  });

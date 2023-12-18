import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import path from "path";

class App {
  port;
  mongo_uri;
  express;

  constructor(controllers, mongo_uri) {
    this.express = express();
    dotenv.config();
    this.port = process.env.PORT_NUMBER;
    this.mongo_uri = mongo_uri;
    this.path;

    //* custom methods
    this.initiateMiddleware();
    this.establishDBConnection();
    this.initiateControllers(controllers);
    this.initializeErrorMiddleware();
  }

  initiateMiddleware() {
    this.express.use(cors({ origin: "*" }));
    this.express.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'", "https://firebasestorage.googleapis.com"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://firebasestorage.googleapis.com",
          ],
          imgSrc: ["'self'", "https://firebasestorage.googleapis.com"],
        },
      })
    );
    this.express.use(compression());
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(cookieParser());
  }

  establishDBConnection() {
    mongoose
      .connect(this.mongo_uri)
      .then(() => {
        console.log("DB connection established");
      })
      .catch((err) => {
        console.log(`Error: ${err.message}`);
      });
  }

  initiateControllers(controllers) {
    try {
      const __dirname = path.resolve();
      const frontendPath = path.join(__dirname, "frontend", "dist");

      this.express.use(express.static(frontendPath));

      this.express.get("*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
      });

      //* API Routes
      controllers.forEach((controller) => {
        this.express.use("/api", controller.router);
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  initializeErrorMiddleware() {
    this.express.use(errorMiddleware);
  }

  listen() {
    this.express.listen(this.port, () => {
      console.log(`Server is connected on port: ${this.port}`);
    });
  }
}

export default App;

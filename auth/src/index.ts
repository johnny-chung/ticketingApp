import mongoose from "mongoose";
import { app } from "./app";

// move the app to app.js -> setup for testing
//    -> app from app.ts don't have hardcoded port written below

//----------- mongoose -----

// old version of node don't support await in top level
// need to put inside a func
async function start() {
  // await mongoose.connect('mongodb://localhost') // if we are running mongo locally

  // we use cluster ip here
  try {
    // check env in first run
    if (!process.env.JWT_KEY) {
      throw new Error("JWT key not define");
    }
    if (!process.env.MONGO_URI) {
      throw new Error("Mongo uri not define");
      // read mongo url from env
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }

  // listen to port after successful connection to db
  app.listen(3000, () => {
    console.log("Auth Service Listening on port 3000!");
  });
}

start();

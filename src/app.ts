import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import cors from "cors";
import mongoose from "mongoose";
import { router } from "./routes/index";
import { dbInitialize } from "./helper/db";
import { redisInitialize } from "./helper/redis";
// API keys and Passport configuration

// Create Express server
const app = express();
dbInitialize(mongoose);
redisInitialize();

// Express configuration
app.set("port", process.env.PORT || 3000);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors());
app.use(lusca.xssProtection(true));

/**
 * API routes.
 */

app.use("/api", router);


export default app;

import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.debug("Using .env.example file to supply config environment variables");
    dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}

export const ENVIRONMENT = process.env.NODE_ENV;

const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGODB_URI = process.env["MONGODB_URI"];


export const REDIS_URL = process.env["REDIS_URL"];

export const REDIS_PASSWORD = process.env["REDIS_PASSWORD"];


export const JWT_EXPIRY = process.env["JWT_EXPIRY"];

export const JWT_SECRET = process.env["JWT_SECRET"];


if (!SESSION_SECRET) {
    logger.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!MONGODB_URI) {
    if (prod) {
        logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
    } else {
        logger.error("No mongo connection string. Set MONGODB_URI_LOCAL environment variable.");
    }
    process.exit(1);
}



if (!REDIS_URL) {
    logger.error("No Redis Url. Set REDIS_URL environment variable.");
    process.exit(1);
}


if (!REDIS_PASSWORD) {
    logger.error("No redis password. Set REDIS_PASSWORD environment variable.");
    process.exit(1);
}


if (!JWT_SECRET) {
    logger.error("No jwt secret. Set JWT_SECRET environment variable.");
    process.exit(1);
}

if (!JWT_EXPIRY) {
    logger.error("No jwt expiry. Set JWT_EXPIRY environment variable.");
    process.exit(1);
}

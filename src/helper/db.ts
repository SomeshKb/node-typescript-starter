// Connect to MongoDB

import { Mongoose } from "mongoose";
import { MONGODB_URI } from "../util/secrets";
const mongoUrl = MONGODB_URI;

export const dbInitialize = (mongoose : Mongoose) => {

        mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(
            () => {
                console.log("DB connected");
            },
        ).catch(err => {
            console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
            // process.exit();
        });

};



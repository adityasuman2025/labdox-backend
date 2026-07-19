import mongoose from "mongoose";
import { MONGO_URI, MONGO_DB } from "../constants.js";

const dbConnection = mongoose.connect(MONGO_URI, { dbName: MONGO_DB })
    .then((m) => {
        console.log("Database connected successfully");
        return m;
    }).catch((err) => {
        console.error("Database connection error:", err);
        throw err;
    });

export default dbConnection;

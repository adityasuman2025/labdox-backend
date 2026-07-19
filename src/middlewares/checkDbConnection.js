import mongoose from "mongoose";
import { errorCatch } from "../utils/response.js";
import dbConnection from "../utils/db.js";

export default async function checkDbConnection(req, res, next) {
    try {
        if (mongoose.connection.readyState !== 1) await dbConnection;

        next();
    } catch (err) {
        errorCatch(err, req, res);
    }
}

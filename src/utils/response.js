import mongoose from "mongoose";
import { GENERAL_ERROR } from "../constants.js";

export function send200(res, data) {
    res.status(200).json({ status: 200, data })
}

export function sendError(res, status, message) {
    res.status(status).json({ status: status, message })
}

export function errorCatch(err, req, res) {
    console.log(req?.method, req?.originalUrl, "api error:", err?.message)

    if (err instanceof mongoose.Error || err.name === "MongoServerError") return sendError(res, 400, err.message);
    sendError(res, 500, GENERAL_ERROR);
}

export function apiHandler(func) {
    return async function (...args) {
        const [req, res] = args;

        try {
            return await func(...args);
        } catch (err) {
            errorCatch(err, req, res)
        }
    }
}
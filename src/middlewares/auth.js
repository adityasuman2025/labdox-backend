import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY, ADMIN_AUTH_TOKEN_KEY, AUTH_TOKEN_KEY } from "../constants.js";
import UserModel from "../models/UserModel.js";
import { apiHandler, sendError } from "../utils/response.js";

export const userAuth = apiHandler(async (req, res, next) => {
    let token = (req.cookies?.[AUTH_TOKEN_KEY] || "").trim();
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return sendError(res, 401, "un-authorized");

    const { _id } = jwt.verify(token, JWT_SECRET_KEY) || {};
    if (!_id) return sendError(res, 401, "un-authorized");

    const user = await UserModel.findOne({ _id, isAdmin: false });
    if (user) {
        req.loggedUser = user;
        return next();
    } else return sendError(res, 401, "un-authorized");
});

export const adminAuth = apiHandler(async (req, res, next) => {
    let adminToken = (req.cookies?.[ADMIN_AUTH_TOKEN_KEY] || "").trim();
    if (!adminToken && req.headers.authorization?.startsWith("Bearer ")) {
        adminToken = req.headers.authorization.split(" ")[1];
    }
    if (!adminToken) return sendError(res, 401, "un-authorized");

    const { _id } = jwt.verify(adminToken, JWT_SECRET_KEY) || {};
    if (!_id) return sendError(res, 401, "un-authorized");

    const admin = await UserModel.findOne({ _id, isAdmin: true });
    if (admin) {
        req.loggedAdmin = admin;
        return next();
    } else return sendError(res, 401, "un-authorized");
});
import { Router } from "express";
import validator from "validator";
import UserModel from "../models/UserModel.js";
import { send200, sendError, apiHandler } from "../utils/response.js";
import { setCookie, clearCookie } from "../utils/cookie.js";
import { getHashedPassword } from "../utils/hashing.js";
import { AUTH_METHOD_EMAIL, AUTH_METHOD_GOOGLE, AUTH_TOKEN_KEY, ADMIN_AUTH_TOKEN_KEY, TOKEN_EXPIRY_DAYS } from "../constants.js";
import WaitlistModel from "../models/WaitlistModel.js";

const authRouter = new Router();

authRouter.post("/user/login", apiHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim() || !validator.isEmail(email)) return sendError(res, 400, "missing email or password");

    const user = await UserModel.findOne({ email, isAdmin: false, authMethod: AUTH_METHOD_EMAIL });
    if (user) {
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const jwtToken = await user.createJWT();
            setCookie(res, AUTH_TOKEN_KEY, jwtToken, TOKEN_EXPIRY_DAYS);

            const waitlistData = await WaitlistModel.findOne({ userId: user._id });

            return send200(res, {
                email: user.email, id: user._id,
                isWaitlisted: waitlistData ? true : false, waitlistData,
                token: jwtToken
            })
        } else return sendError(res, 400, "invalid credentials");
    } else return sendError(res, 400, "invalid credentials");
}));

authRouter.post("/user/signup", apiHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim() || !validator.isEmail(email)) return sendError(res, 400, "missing email or password");

    const hassedPassword = await getHashedPassword(password);
    const user = new UserModel({ email, password: hassedPassword, authMethod: AUTH_METHOD_EMAIL });
    await user.save();

    return send200(res, "new user added");
}));

authRouter.post("/admin/login", apiHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim() || !validator.isEmail(email)) return sendError(res, 400, "missing email or password");

    const user = await UserModel.findOne({ email, isAdmin: true, authMethod: AUTH_METHOD_EMAIL });
    if (user) {
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const jwtToken = await user.createJWT();
            setCookie(res, ADMIN_AUTH_TOKEN_KEY, jwtToken, TOKEN_EXPIRY_DAYS);

            return send200(res, { email: user.email, id: user._id, token: jwtToken })
        } else return sendError(res, 400, "invalid credentials");
    } else return sendError(res, 400, "invalid credentials");
}));

authRouter.get("/logout", apiHandler(async (req, res) => {
    clearCookie(res, AUTH_TOKEN_KEY, { maxAge: 0, expires: new Date() });
    clearCookie(res, ADMIN_AUTH_TOKEN_KEY, { maxAge: 0, expires: new Date() });

    return send200(res, "logged out successfully");
}));

authRouter.post("/user/google", apiHandler(async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) return sendError(res, 400, "missing google token");

    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!response.ok) return sendError(res, 401, "invalid google token");

    const payload = await response.json();
    const { email, sub: googleId } = payload;
    if (!email) return sendError(res, 400, "email not found in google token");

    let user = await UserModel.findOne({ email, isAdmin: false });
    if (!user) {
        user = new UserModel({ email, authMethod: AUTH_METHOD_GOOGLE, googleId });
        await user.save();
    }

    const jwtToken = await user.createJWT();
    setCookie(res, AUTH_TOKEN_KEY, jwtToken, TOKEN_EXPIRY_DAYS);

    const waitlistData = await WaitlistModel.findOne({ userId: user._id });

    return send200(res, {
        email: user.email, id: user._id,
        isWaitlisted: waitlistData ? true : false, waitlistData,
        token: jwtToken
    });
}));

authRouter.post("/admin/google", apiHandler(async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) return sendError(res, 400, "missing google token");

    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!response.ok) return sendError(res, 401, "invalid google token");

    const payload = await response.json();
    const { email } = payload;
    if (!email) return sendError(res, 400, "email not found in google token");

    const user = await UserModel.findOne({ email, isAdmin: true });
    if (!user) return sendError(res, 400, "not a admin")

    const jwtToken = await user.createJWT();
    setCookie(res, ADMIN_AUTH_TOKEN_KEY, jwtToken, TOKEN_EXPIRY_DAYS);

    return send200(res, { email: user.email, id: user._id, token: jwtToken });
}));

export default authRouter;
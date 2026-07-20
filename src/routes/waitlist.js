import { Router } from "express";
import { adminAuth, userAuth } from "../middlewares/auth.js";
import WaitlistModel from "../models/WaitlistModel.js";
import UserModel from "../models/UserModel.js";
import { verifyEmailReal, verifyPhoneReal } from "../utils/verifier.js";
import { send200, apiHandler, sendError } from "../utils/response.js";

const waitlistRouter = new Router();

waitlistRouter.get("/", adminAuth, apiHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query || {};
    const skip = (Number(page) - 1) * Number(limit);

    const userIds = search ? await UserModel.find({ email: { $regex: search, $options: "i" } }).distinct("_id") : [];
    const query = search ? {
        $or: [
            { fullName: { $regex: search, $options: "i" } },
            { phoneNumber: { $regex: search, $options: "i" } },
            { userId: { $in: userIds } }
        ]
    } : {};

    const [items, totalItems] = await Promise.all([
        WaitlistModel.find(query).populate("userId", "email authMethod").skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
        WaitlistModel.countDocuments(query)
    ]);

    send200(res, { items, page: Number(page), limit: Number(limit), totalItems });
}));

waitlistRouter.post("/", userAuth, apiHandler(async (req, res) => {
    const userId = req.loggedUser._id;
    const userEmail = req.loggedUser.email;

    const fullName = (req.body.fullName || "").trim();
    const phoneNumber = (req.body.phoneNumber || "").trim();
    const interestReason = (req.body.interestReason || "").trim();
    const useCase = (req.body.useCase || "").trim();

    if (!fullName || !phoneNumber || !interestReason || !useCase) return sendError(res, 400, "some fields data are missing");
    if (!userId || !userEmail) return sendError(res, 400, "missing user details");

    const waitlist = new WaitlistModel({ userId, fullName, phoneNumber, interestReason, useCase });
    await waitlist.save();

    // doing expensive api call to add validation status data in the current waitlist document
    waitlist.phoneValidationStatus = await verifyPhoneReal(phoneNumber);
    waitlist.emailValidationStatus = await verifyEmailReal(userEmail);
    await waitlist.save();

    send200(res, waitlist);
}));

export default waitlistRouter;

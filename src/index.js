import express from "express";
import cookieParser from "cookie-parser";
import cors from "./middlewares/cors.js";
import checkEnvVariables from "./middlewares/checkEnvVariables.js";
import checkDbConnection from "./middlewares/checkDbConnection.js";
import authRouter from "./routes/auth.js";
import waitlistRouter from "./routes/waitlist.js";
import { send200, sendError } from "./utils/response.js";
import { SERVER_PORT, WELCOME_MSG, NOT_FOUND_ERROR, GENERAL_ERROR } from "./constants.js";

const app = new express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(checkEnvVariables);
app.use(checkDbConnection);


app.use("/auth", authRouter);
app.use("/waitlist", waitlistRouter);


app.get("/ping", (req, res) => send200(res, WELCOME_MSG));
app.get("/", (req, res) => send200(res, WELCOME_MSG));
app.use("/", (req, res) => sendError(res, 404, NOT_FOUND_ERROR));
app.use("/", (err, req, res, next) => {
    console.error(err);
    if (res.headersSent) return next(err);
    sendError(res, 500, GENERAL_ERROR);
});

app.listen(SERVER_PORT, () => console.log("Server is running on port", SERVER_PORT));
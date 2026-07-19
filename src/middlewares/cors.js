import _cors from "cors";
import { ALLOWED_ORIGINS } from "../constants.js";

export default function corsMiddleware() {
    return function (req, res, next) {
        const corsOptions = {
            origin: function (origin, callback) {
                if (!origin) return callback(null, true);

                if (ALLOWED_ORIGINS.includes(origin)) callback(null, true);
                else callback(new Error('Not allowed by CORS'));
            },
            credentials: true
        };

        _cors(corsOptions)(req, res, next);
    };
}
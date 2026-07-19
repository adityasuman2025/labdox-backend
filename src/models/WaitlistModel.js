import { model, Schema } from "mongoose";
import validator from "validator";
import { STATUS_INVALID, VALIDATION_STATUSES } from "../constants.js";

const WaitlistSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User id is required"],
        unique: [true, "Already waitlisted"],
    },
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        index: true,
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        unique: [true, "Phone number is already registered on the waitlist"],
        trim: true,
        index: true,
        validate: function (value) {
            if (!validator.isMobilePhone(value)) throw new Error("Not a valid mobile number");
        }
    },
    interestReason: {
        type: String,
        required: [true, "Interest reason is required"],
        trim: true,
    },
    useCase: {
        type: String,
        required: [true, "Use case is required"],
        trim: true,
    },
    emailValidationStatus: {
        type: String,
        enum: VALIDATION_STATUSES,
        default: STATUS_INVALID,
    },
    phoneValidationStatus: {
        type: String,
        enum: VALIDATION_STATUSES,
        default: STATUS_INVALID,
    },
}, { timestamps: true });

export default model("waitlists", WaitlistSchema);
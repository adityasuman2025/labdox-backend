import { model, Schema } from "mongoose";
import validator from "validator";
import { STATUS_INVALID, VALIDATION_STATUSES } from "../constants.js";

const WaitlistSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: [true, "user id is required"],
        unique: [true, "already waitlisted"],
    },
    fullName: {
        type: String,
        required: [true, "full name is required"],
        trim: true,
        index: true,
    },
    phoneNumber: {
        type: String,
        required: [true, "phone number is required"],
        unique: [true, "phone number is already registered on the waitlist"],
        trim: true,
        index: true,
        validate: function (value) {
            if (!validator.isMobilePhone(value)) throw new Error("not a valid mobile number");
        }
    },
    interestReason: {
        type: String,
        required: [true, "interest reason is required"],
        trim: true,
    },
    useCase: {
        type: String,
        required: [true, "use case is required"],
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
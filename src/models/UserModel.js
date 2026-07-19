import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import validator from "validator";
import { AUTH_METHOD_EMAIL, AUTH_METHOD_GOOGLE, AUTH_METHODS, JWT_SECRET_KEY, TOKEN_EXPIRY_DAYS } from "../constants.js";

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email is already taken"],
        lowercase: true,
        trim: true,
        index: true,
        validate: function (value) {
            if (!validator.isEmail(value)) throw new Error("Not a valid email id")
        }
    },
    password: {
        type: String,
        required: function () {
            return this.authMethod === AUTH_METHOD_EMAIL
        }
    },
    authMethod: {
        type: String,
        required: [true, "Auth method is required"],
        enum: AUTH_METHODS,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
        required: function () {
            return this.authMethod === AUTH_METHOD_GOOGLE
        }
    }
}, { timestamps: true });

UserSchema.methods.validatePassword = async function (password) {
    const dbPassword = this.password;
    return await compare(password, dbPassword);
}

UserSchema.methods.createJWT = async function () {
    const user = this;
    return await jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: TOKEN_EXPIRY_DAYS + "d" });
}

export default model("users", UserSchema);
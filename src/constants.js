import dotenv from "dotenv";
dotenv.config();

export const SERVER_PORT = process.env.PORT || '2000';
export const MONGO_URI = process.env.MONGO_URI;
export const MONGO_DB = process.env.MONGO_DB;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const ABSTRACT_EMAIL_API_URL = `https://emailreputation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_EMAIL_API_KEY}`;
export const ABSTRACT_PHONE_API_URL = `https://phoneintelligence.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_PHONE_API_KEY}`;

export const AUTH_TOKEN_KEY = "token";
export const ADMIN_AUTH_TOKEN_KEY = "admin-token";
export const TOKEN_EXPIRY_DAYS = 7;
export const WELCOME_MSG = "Welcome to api server";
export const ALLOWED_ORIGINS = ["http://localhost:5173", "http://localhost:3000"];

export const GENERAL_ERROR = "Semething went wrong";
export const NOT_FOUND_ERROR = "Route not found";


export const AUTH_METHOD_EMAIL = "email";
export const AUTH_METHOD_GOOGLE = "google";
export const AUTH_METHODS = [AUTH_METHOD_EMAIL, AUTH_METHOD_GOOGLE];

export const STATUS_VALID = "valid";
export const STATUS_INVALID = "invalid";
export const STATUS_APPROVED = "approved";
export const VALIDATION_STATUSES = [STATUS_VALID, STATUS_INVALID, STATUS_APPROVED];
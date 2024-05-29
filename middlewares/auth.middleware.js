import { ApiError } from "../handlers/error.handler.js";
import jwt from "jsonwebtoken";
import ApiResponse from "../handlers/response.handler.js";

export const authToLoginUserOnly = (req, res, next) => {
    try {
        const token = getTokenFromRequest(req);
        console.log("Token:", token); 
        if (!token) {
            throw new ApiError(401, "Token Not Found");
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Payload:", payload); 
        req.user = payload;
        next();
    } catch (error) {
        return ApiResponse.error(
            res,
            error.message || "Internal Server Error",
            error.statusCode || 500
        );
    }
};

const getTokenFromRequest = (req) => {
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer")) {
        return authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
        return req.cookies.token;
    }
    return null;
};

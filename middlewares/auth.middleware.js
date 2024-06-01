import { ApiError } from "../handlers/error.handler.js";
import jwt from "jsonwebtoken";
import ApiResponse from "../handlers/response.handler.js";
import connection from "../config/db.js";

export const authToLoginUserOnly = async (req, res, next) => {
	try {
		const token = getTokenFromRequest(req);
		if (!token) {
			throw new ApiError(401, "Token Not Found! Please Login First!");
		}
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		const [userResult] = await connection.execute(
			"SELECT id, username, email, role FROM users WHERE id = ?",
			[payload.id]
		);
		if (userResult.length === 0) {
			throw new ApiError(401, "User not found");
		}
		req.user = userResult[0];
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

export const authToAdminOnly = (...roles) => {
    console.log('authToAdminOnly middleware')
	return async (req, res, next) => {
		try {
            console.log(req.user.role)
			if (roles.includes(req.user.role)) {
				next();
			} else {
				throw new ApiError(
					401,
					"You are not authorized to perfrom this action!"
				);
			}
		} catch (error) {
			return ApiResponse.error(
				res,
				error.message || "Internal Server Error",
				error.statusCode || 500
			);
		}
	};
};

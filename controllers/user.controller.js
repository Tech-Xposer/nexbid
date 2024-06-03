import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import ApiResponse from "../handlers/response.handler.js";
import { ApiError } from "../handlers/error.handler.js";
import connection from "../config/db.js";
import { userVerificationTemplate } from "../services/templates.service.js";
import {
	createEmailVerificationToken,
	createUserLoginToken,
} from "../services/token.service.js";
import sendEmail from "../services/email.service.js";

export const register = async (req, res) => {
	try {
		const { username, password, email, role } = req.body;

		//validations and checks
		if (!username || !password || !email) {
			throw new ApiError(400, "All Feilds Required");
		}
		if (!validator.isEmail(email)) {
			throw new ApiError(400, "Invalid Email");
		}
		if (password.length < 6) {
			throw new ApiError(400, "Password must be at least 6 characters");
		}
		if (!validator.isStrongPassword(password)) {
			throw new ApiError(
				400,
				"Password must be at least 6 characters, must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character"
			);
		}
		//checking if user already exists
		const [user] = await connection.execute(
			"SELECT * FROM USERS WHERE username =? OR email = ?",
			[username, email],
			(err, res) => {
				if (err) throw err;
				console.log("result->", res);
			}
		);
		if (user.length > 0) {
			throw new ApiError(400, "User already exists");
		}

		//hashing password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// creating user
		const [{ insertId }] = await connection.execute(
			"INSERT INTO USERS SET username = ?, email = ?, password = ?",
			[username, email, hashedPassword]
		);

		// creating email verification token
		const verificationToken = createEmailVerificationToken({ id: insertId });
		const verificationLink = `${process.env.BASE_URL}/api/v1/users/verify/${verificationToken}`;

		const checkMail = await sendEmail(
			email,
			userVerificationTemplate(username, verificationLink)
		);

		return ApiResponse.created(res, {
			id: insertId,
			username,
			email,
		});
	} catch (err) {
		return ApiResponse.error(res, err.message, err.statusCode || 500);
	}
};

export const login = async (req, res) => {
	try {
		const options = {
			maxAge: 1000 * 60 * 60 * 24,
			httpOnly: true, // The cookie only accessible by the web server
			signed: true,
			secure: true,
		};
		const { username, password } = req.body;
		if (!username || !password) {
			throw new ApiError(400, "All Feilds Required");
		}
		const [user] = await connection.execute(
			"SELECT * FROM USERS WHERE username = ?",
			[username],
			(err, res) => {
				if (err) throw err;
				console.log("result->", res);
			}
		);
		if (user.length < 1) {
			throw new ApiError(400, "User Not Found");
		}
		const currentUser = user[0];
		const isMatch = await bcrypt.compare(password, currentUser.password);
		if (!isMatch) {
			throw new ApiError(400, "Invalid Password");
		}

		//check is user verified
		if (currentUser.is_verified === 0) {
			throw new ApiError(400, "Please Verify Your Email");
		}
		console.log(currentUser);
		const token = createUserLoginToken({ id: currentUser.id });
		console.log(token);
		res.cookie("token", token, options);
		return ApiResponse.success(res, 200, "Login Successful", {
			token,
		});
	} catch (err) {
		return ApiResponse.error(res, err.message, err.statusCode || 500);
	}
};

export const getUserProfile = async (req, res) => {
	try {
		const { id } = req.user;
		const [user] = await connection.execute(
			"SELECT * FROM USERS WHERE id = ?",
			[id],
			(err, res) => {
				if (err) throw err;
				console.log("result->", res);
			}
		);
		delete user[0].password
		return ApiResponse.success(res, 200, "User Profile", user[0]);
	} catch (error) {
		return ApiResponse.error(res, error.message, error.statusCode || 500);
	}
};

export const verifyUser = async (req, res) => {
	try {
		const { token } = req.params;
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		console.log(payload);
		const [user] = await connection.execute(
			"SELECT * FROM USERS WHERE id = ?",
			[payload.id],
			(err, res) => {
				if (err) throw err;
				console.log("result->", res);
			}
		);

		if (user.length < 1) {
			return ApiResponse.error(res, "User Not Found", 400);
		}

		await connection.execute(
			"UPDATE USERS SET is_verified = ? WHERE id = ?",
			[true, payload.id],
			(err, res) => {
				if (err) throw err;
				console.log("result->", res);
			}
		);

		return ApiResponse.success(res, 200, "User Verified Successfully", {
			id: payload.id,
		});
	} catch (err) {
		return ApiResponse.error(res, err.message, err.statusCode || 500);
	}
};

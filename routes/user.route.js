import express from "express";
import {
	changePassword,
	generateResetPasswordEmail,
	getUserProfile,
	login,
	register,
    verifyUser,
} from "../controllers/user.controller.js";
import { authToLoginUserOnly } from "../middlewares/auth.middleware.js";

const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.get("/profile", [authToLoginUserOnly], getUserProfile);
userRoute.get('/verify/:token', verifyUser)
userRoute.post('/reset-password', generateResetPasswordEmail)
userRoute.put('/change-password/:token', changePassword)


export default userRoute;

import express from "express";
import {
	getNotifications,
	markNotificationsAsRead,
} from "../controllers/notification.controller.js";
import { authToLoginUserOnly } from "../middlewares/auth.middleware.js";

const notificationRoute = express.Router();

notificationRoute.get("/", authToLoginUserOnly, getNotifications);
notificationRoute.post(
	"/mark-read",
	authToLoginUserOnly,
	markNotificationsAsRead
);

export default notificationRoute;

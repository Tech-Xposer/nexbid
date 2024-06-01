import express from "express";

import userRoute from "./user.route.js";
import itemRoute from "./item.route.js";
import bidRoute from "./bid.route.js";
import notificationRoute from "./notification.route.js";
const router = express.Router();

router.use("/users", userRoute);
router.use("/items", itemRoute);
router.use("/notifications", notificationRoute);
router.use("/", bidRoute);

export default router;

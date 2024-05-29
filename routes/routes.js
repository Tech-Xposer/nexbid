import express from "express";
import route from "./user.route.js";
import userRoute from "./user.route.js";
const router = express.Router();

router.use("/users", userRoute);

export default router;

import express from "express";
import {
	deleteBid,
	getBidsByItemId,
	placeBid,
} from "../controllers/bid.controller.js";
import {
	authToAdminOnly,
	authToLoginUserOnly,
} from "../middlewares/auth.middleware.js";

const bidRoute = express();

bidRoute
	.route("/items/:itemId/bids")
	.get(authToLoginUserOnly, getBidsByItemId)
	.post(authToLoginUserOnly, placeBid);

bidRoute
	.route("/bids/:bidId")
	.delete(authToLoginUserOnly, authToAdminOnly("admin"), deleteBid);

export default bidRoute;

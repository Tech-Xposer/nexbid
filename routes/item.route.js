import express from "express";
import {
	createItem,
	getItems,
	getItemById,
	updateItemById,
	deleteItemById,
} from "../controllers/item.controller.js";
import { authToLoginUserOnly } from "../middlewares/auth.middleware.js";
import { upload } from "../services/multer.service.js";

const itemRoute = express.Router();

itemRoute
	.route("/")
	.get(authToLoginUserOnly, getItems)
	.post(authToLoginUserOnly, upload.single("image"), createItem);

itemRoute
	.route("/:id")
	.get(getItemById)
	.put(authToLoginUserOnly, updateItemById)
	.delete(authToLoginUserOnly, deleteItemById);

export default itemRoute;

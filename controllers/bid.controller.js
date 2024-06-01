import connection from "../config/db.js";
import ApiResponse from "../handlers/response.handler.js";
import { ApiError } from "../handlers/error.handler.js";

export const getBidsByItemId = async (req, res) => {
	try {
		const { itemId } = req.params;

		const [bids] = await connection.execute(
			"SELECT * FROM bids WHERE item_id = ?",
			[itemId]
		);

		if (bids.length === 0) {
			throw new ApiError(404, "No bids found for this item");
		}

		return ApiResponse.success(res, 200, "Bids fetched successfully", { bids });
	} catch (error) {
		return ApiResponse.error(res, error.message, error.statusCode || 500);
	}
};

export const placeBid = async (req, res) => {
	try {
		const { itemId } = req.params;
		const { bid_amount } = req.body;
		console.log(req.user);
		if (!bid_amount || bid_amount <= 0) {
			throw new ApiError(400, "Bid amount must be greater than zero");
		}

		const [itemResult] = await connection.execute(
			"SELECT * FROM items WHERE id = ?",
			[itemId]
		);

		if (itemResult.length === 0) {
			throw new ApiError(404, "Item not found");
		}

		const item = itemResult[0];

		if (new Date(item.end_time) < new Date()) {
			throw new ApiError(400, "Bidding time has ended for this item");
		}

		if (bid_amount <= item.current_price) {
			throw new ApiError(
				400,
				"Bid amount must be higher than the current price"
			);
		}
		console.log(
			"amount->",
			bid_amount,
			"itemId=>",
			itemId,
			"user Id=>",
			req.user.id
		);
		const [bidResult] = await connection.execute(
			"INSERT INTO BIDS SET item_id = ?, user_id = ?, bid_amount = ?",
			[itemId, req.user.id, bid_amount]
		);
		console.log(bidResult);
		await connection.execute(
			"UPDATE items SET current_price = ? WHERE id = ?",
			[bid_amount, itemId]
		);

		return ApiResponse.success(res, 201, "Bid placed successfully", {
			bidId: bidResult.insertId,
		});
	} catch (error) {
		return ApiResponse.error(res, error.message, error.statusCode || 500);
	}
};

export const deleteBid = async (req, res) => {
	try {
		const { bidId } = req.params;
        if(!bidId){
            throw new ApiError(400, "Bid Id is required");
        }
		const [resultItem] = await connection.execute(
			"SELECT * FROM BIDS WHERE ID = ?",
			[bidId]
		);
		if (resultItem.length === 0) {
			throw new ApiError(404, "Bid not found");
		}
		const [deleteItem] = await connection.execute(
			"DELETE FROM bids WHERE id = ?",
			[bidId]
		);
		console.log(deleteItem);
		return ApiResponse.success(res, 200, "Bid deleted successfully");
	} catch (error) {
		return ApiResponse.error(res, error.message, error.statusCode || 500);
	}
};

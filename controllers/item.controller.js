import validator from "validator";
import { ApiError } from "../handlers/error.handler.js";
import connection from "../config/db.js";
import ApiResponse from "../handlers/response.handler.js";

export const createItem = async (req, res) => {
	try {
		const { name, description, starting_price, current_price, end_time } =
			req.body;
		const image_url = req.file ? req.file.filename : null;

		// Validations
		if (!name || !description || !starting_price || !end_time) {
			throw new ApiError(400, "All fields required!");
		}
		if (new Date(end_time) < new Date()) {
			throw new ApiError(400, "End time must be in the future!");
		}
		if (starting_price < 0) {
			throw new ApiError(400, "Starting price must be greater than 0!");
		}

		// Inserting into the database
		const [result] = await connection.execute(
			"INSERT INTO ITEMS (name, description, starting_price, current_price, image_url, end_time, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[
				name,
				description,
				starting_price,
				current_price || starting_price,
				image_url,
				new Date(end_time).toISOString().slice(0, 19).replace("T", " "),
				req.user.id,
			]
		);

		return ApiResponse.success(res, 201, "Item created successfully", {
			itemId: result.insertId,
		});
	} catch (error) {
		return ApiResponse.error(res, error.message, error.statusCode || 500);
	}
};

export const getItems = async (req, res) => {
	try {
		const [result] = await connection.execute("SELECT * FROM ITEMS ");
		return ApiResponse.success(res, 200, "Items fetched successfully", {
			total_items: result.length,
			items: result,
		});
	} catch (error) {
		return ApiResponse.error(res, error.message, error.statusCode || 500);
	}
};

export const getItemById = async (req, res) => {
	try {
		const { id } = req.params;

		const [result] = await connection.execute(
			"SELECT * FROM ITEMS WHERE id = ?",
			[id]
		);

		if (result.length === 0) {
			throw new ApiError(404, "Item not found");
		}

		return ApiResponse.success(res, 200, "Item fetched successfully", {
			item: result[0],
		});
	} catch (error) {
		return ApiResponse.error(res, error.message, error.statusCode || 500);
	}
};

export const deleteItemById = async (req, res) => {
	try {
		const { id } = req.params;
		const [itemResult] = await connection.execute(
			"SELECT * FROM ITEMS WHERE id =?",
			[id]
		);

		if (itemResult.length === 0) {
			throw new ApiError(404, "Item not found");
		}

		// Check if the user is authorized to delete the item
		if (itemResult[0].created_by !== req.user.id && req.user.role !== "admin") {
			throw new ApiError(403, "You don't have permission to delete this item");
		}

		const [result] = await connection.execute(
			"DELETE FROM ITEMS WHERE id = ? ",
			[id]
		);

		return ApiResponse.success(res, 200, "Item deleted successfully");
	} catch (error) {
		return ApiResponse.error(res, error.message, error.statusCode || 500);
	}
};

export const updateItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, starting_price, current_price, end_time } = req.body;
        const image_url = req.file ? req.file.filename : null;

        // Check if the user is the owner or admin
        const [itemResult] = await connection.execute("SELECT * FROM ITEMS WHERE id = ?", [id]);
        if (itemResult.length === 0) {
            throw new ApiError(404, "Item not found");
        }
        const item = itemResult[0];

        if (item.created_by !== req.user.id && req.user.role !== 'admin') {
            throw new ApiError(403, "You don't have permission to update this item");
        }

        // Validations
        if (!name || !description || !starting_price || !end_time) {
            throw new ApiError(400, "All fields required!");
        }
        if (new Date(end_time) < new Date()) {
            throw new ApiError(400, "End time must be in the future!");
        }
        if (starting_price < 0) {
            throw new ApiError(400, "Starting price must be greater than 0!");
        }

        // Update the item in the database
        const [result] = await connection.execute(
            "UPDATE ITEMS SET name = ?, description = ?, starting_price = ?, current_price = ?, image_url = ?, end_time = ? WHERE id = ?",
            [
                name,
                description,
                starting_price,
                current_price || starting_price,
                image_url,
                new Date(end_time).toISOString().slice(0, 19).replace('T', ' '),
                id
            ]
        );

        return ApiResponse.success(res, 200, "Item updated successfully");
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500);
    }
};

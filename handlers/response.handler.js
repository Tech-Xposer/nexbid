class ApiResponse {
	static success(res, status = 200, message, data) {
		res.status(status).json({
			status: "success",
			message:message,
			data: data,
		});
	}

	static error(res, error, status = 500) {
		res.status(status).json({
			status: "error",
			error: error,
		});
	}

	static notFound(res) {
		res.status(404).json({
			status: "error",
			error: "Not found",
		});
	}

	static badRequest(res, error) {
		res.status(400).json({
			status: "error",
			error: error,
		});
	}

	static unAuthorized(res, error) {
		res.status(401).json({
			status: "error",
			error: error,
		});
	}

	static forbidden(res, error) {
		res.status(403).json({
			status: "error",
			error: error,
		});
	}

	static conflict(res, error) {
		res.status(409).json({
			status: "error",
			error: error,
		});
	}

	static internalServerError(res, error) {
		res.status(500).json({
			status: "error",
			error: error,
		});
	}
}

export default ApiResponse;

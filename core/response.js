class Response {
	static eventList = [];

	/**
	 * Send success answer
	 * @param data
	 */
	static success(data = []){
		return Response.response
			.status(200)
			.json({
			type: "success",
			data: data
		});
	}

	/**
	 * Add error and send events
	 * @param code
	 * @param message
	 */
	static error(code, message){
		Response.eventList.push({
			type: "error",
			code: code,
			message: message
		});

		return Response.response
			.status(200)
			.json({
			type: "error",
			data: Response.eventList
		});
	}

	/**
	 * Add warning event
	 * @param message
	 */
	static warning(message){
		Response.eventList.push({
			type: "warning",
			message: message
		});
	}

	/**
	 * Setter for response object
	 * @param response
	 */
	static set(response){
		Response.response = response;
	}
}

module.exports = Response;
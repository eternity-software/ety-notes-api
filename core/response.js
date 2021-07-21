class Response {
	/**
	 * Constructor
	 */
	constructor() {
		this.eventList = [];
	}

	/**
	 * Send success answer
	 * @param data
	 */
	success(data = []){
		return this.response
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
	error(code, message){
		this.eventList.push({
			type: "error",
			code: code,
			message: message
		});

		return this.response
			.status(200)
			.json({
			type: "error",
			data: this.eventList
		});
	}

	/**
	 * Add warning event
	 * @param message
	 */
	warning(message){
		this.eventList.push({
			type: "warning",
			message: message
		});
	}

	/**
	 * Setter for response object
	 * @param response
	 */
	set(response){
		this.response = response;
	}
}

module.exports = Response;
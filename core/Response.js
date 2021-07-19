class Response {
	/**
	 * Constructor
	 * @param response
	 */
	constructor(response) {
		this.response = response;
		this.eventList = [];
	}

	/**
	 * Send success answer
	 * @param data
	 */
	success(data = []){
		this.response.send({
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

		this.response.send({
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
}

module.exports = Response;
const Response = require("./Response");
const app_config = require("../config/app.config");

class Route {

	constructor(req, res, route) {
		this.version = (req.query.v) ?? app_config.version;
		this.params = (req.method.toUpperCase() === "GET") ? req.query : req.body;
		this.response = new Response(res);

		this.controller = `../route/v${this.version}/${route.controller}`;
		this.controllerParams = {
			response: this.response
		};
		this.method = route.method;

		this.handle();
	}

	handle(){
		try{
			this.module = new(require(this.controller))(this.controllerParams);
			this.module[this.method](this.params);
		}catch (e){
			console.log(`(ROUTE): ${e}`);
			this.response.error(500, e);
		}
	}

}

module.exports = Route;
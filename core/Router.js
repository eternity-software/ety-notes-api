const Response = require("./Response");
const app_config = require("../config/app.config");

class Router {

	/**
	 * Router constructor
	 * @param router
	 */
	constructor(router) {
		this.router = router;
	}

	/**
	 * Register route with GET
	 * @param route
	 */
	get(route){
		this.router.get(route.url, (req, res) => {
			this.handler(req, res, route, req.query);
		});
	}

	/**
	 * Register route with POST
	 * @param route
	 */
	post(route){
		this.router.post(route.url, (req, res) => {
			this.handler(req, res, route, req.body);
		});
	}

	/**
	 * Callback handler
	 * @param req
	 * @param res
	 * @param route
	 * @param params
	 */
	handler(req, res, route, params){
		// Choose version (TODO: add a check for the availability of the selected version)
		const version = (req.query.v) ?? app_config.version;
		// Instance response
		const response = new Response(res);

		// Path to require controller
		const controllerPath = `../route/v${version}/${route.controller}`;
		// Params which are transmitted to controller
		const controllerParams = {
			response: response
		};

		try{
			this.module = new(require(controllerPath))(controllerParams);
			this.module[route.method](params);
		}catch (e){
			console.log(`(ROUTE): ${e}`);
			response.error(500, e);
		}
	}

	/**
	 * Get ready router
	 * @returns {Object}
	 */
	result(){
		return this.router;
	}

}

module.exports = Router;
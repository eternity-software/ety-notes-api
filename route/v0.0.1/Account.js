const Controller = require("../../core/Controller");

class Account extends Controller{
	create({name, email, password}){
		this.response.success([name, email, password]);
	}
}

module.exports = Account;
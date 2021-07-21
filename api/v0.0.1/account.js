const router = require("../../core/router");

router.setup(__dirname);

router.get({
	url: "/create",
	model: "/model/account",
	method: "create",
	params: {
		name: {
			minLength: 4,
			maxLength: 255,
			required: true
		},
		email: {
			regex: /[(\d+)(\w+).]*@(\w+)\.(\w+)/,
			minLength: 4,
			maxLength: 255,
			required: true
		},
		password: {
			minLength: 6,
			required: true
		}
	}
});

router.get({
	url: "/login",
	model: "/model/account",
	method: "login",
	params: {
		email: {
			regex: /[(\d+)(\w+).]*@(\w+)\.(\w+)/,
			minLength: 4,
			maxLength: 255,
			required: true
		},
		password: {
			minLength: 6,
			required: true
		}
	}
});

router.get({
	url: "/getInfo",
	model: "/model/account",
	method: "getInfo",
	params: {
		token: {
			required: true
		}
	}
});

router.get({
	url: "/activate",
	model: "/model/account",
	method: "activate",
	params: {
		token: {
			required: true
		},
		code: {
			minLength: 6,
			maxLength: 6,
			required: true
		}
	}
});


module.exports = router.router();
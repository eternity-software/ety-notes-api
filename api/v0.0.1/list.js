const router = require("../../core/router");

router.setup(__dirname);

router.get({
	url: "/create",
	model: "/model/list",
	method: "create",
	params: {
		token: {
			required: true
		},
		deskId: {
			required: true
		},
		name: {
			minLength: 4,
			maxLength: 255,
			required: true
		},
		description: {
			maxLength: 255,
			required: false
		}
	}
});

router.get({
	url: "/edit",
	model: "/model/list",
	method: "edit",
	params: {
		token: {
			required: true
		},
		id: {
			required: true
		},
		name: {
			minLength: 4,
			maxLength: 255,
			required: true
		},
		description: {
			maxLength: 255,
			required: true
		}
	}
});

router.get({
	url: "/remove",
	model: "/model/list",
	method: "remove",
	params: {
		token: {
			required: true
		},
		id: {
			required: true
		}
	}
});

module.exports = router.router();
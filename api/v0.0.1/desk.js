const router = require("../../core/router");

router.setup(__dirname);

router.get({
	url: "/create",
	model: "/model/desk",
	method: "create",
	params: {
		token: {
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
	url: "/get",
	model: "/model/desk",
	method: "get",
	params: {
		token: {
			required: true
		},
		id: {
			required: true
		}
	}
});

router.get({
	url: "/edit",
	model: "/model/desk",
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
	url: "/getList",
	model: "/model/desk",
	method: "getList",
	params: {
		token: {
			required: true
		}
	}
});

router.get({
	url: "/getMembers",
	model: "/model/desk",
	method: "getMembers",
	params: {
		token: {
			required: true
		},
		id: {
			required: true
		}
	}
});

router.get({
	url: "/addMember",
	model: "/model/desk",
	method: "addMember",
	params: {
		token: {
			required: true
		},
		deskId: {
			required: true
		},
		accountId: {
			required: true
		}
	}
});

router.get({
	url: "/addManager",
	model: "/model/desk",
	method: "addManager",
	params: {
		token: {
			required: true
		},
		deskId: {
			required: true
		},
		accountId: {
			required: true
		}
	}
});

router.get({
	url: "/remove",
	model: "/model/desk",
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
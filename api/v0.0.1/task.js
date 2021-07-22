const router = require("../../core/router");

router.setup(__dirname);

router.get({
	url: "/create",
	model: "/model/task",
	method: "create",
	params: {
		token: {
			required: true
		},
		listId: {
			required: true
		},
		performerId: {
			required: true
		},
		name: {
			minLength: 4,
			maxLength: 255,
			required: true
		},
		target: {
			maxLength: 3000,
			required: true
		},
		create_time: {
			maxLength: 11,
			required: true
		},
		end_time: {
			maxLength: 11,
			required: true
		}
	}
});

router.get({
	url: "/get",
	model: "/model/task",
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
	model: "/model/task",
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
		target: {
			maxLength: 3000,
			required: true
		},
		create_time: {
			maxLength: 11,
			required: true
		},
		end_time: {
			maxLength: 11,
			required: true
		}
	}
});

router.get({
	url: "/getList",
	model: "/model/task",
	method: "getList",
	params: {
		token: {
			required: true
		},
		listId: {
			required: true
		}
	}
});

router.get({
	url: "/addPerformer",
	model: "/model/task",
	method: "addPerformer",
	params: {
		token: {
			required: true
		},
		taskId: {
			required: true
		},
		accountId: {
			required: true
		},
		position: {
			maxLength: 255,
			required: true
		}
	}
});

router.get({
	url: "/getPerformers",
	model: "/model/task",
	method: "getPerformers",
	params: {
		token: {
			required: true
		},
		taskId: {
			required: true
		}
	}
});

router.get({
	url: "/removePerformer",
	model: "/model/task",
	method: "removePerformer",
	params: {
		token: {
			required: true
		},
		taskId: {
			required: true
		},
		accountId: {
			required: true
		}
	}
});

router.get({
	url: "/remove",
	model: "/model/task",
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

router.get({
	url: "/done",
	model: "/model/task",
	method: "done",
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
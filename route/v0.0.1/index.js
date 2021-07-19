const express = require('express');
const router = express.Router();
const Route = require("../../core/Route");

router.get("/account.create", (req, res) => {
	new Route(req, res, {
		controller: "Account",
		method: "create"
	});
});

module.exports = router;
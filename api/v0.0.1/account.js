const express = require("express");
const expressRouter = express.Router();
const Database = require("../../core/database");

expressRouter.get("/create", (req, res) => {

	Database.selectAll("account", (result) => {
		res.send(result);
	});

});

module.exports = expressRouter;
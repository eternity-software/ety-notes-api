const express = require("express");
const expressRouter = express.Router();

expressRouter.get("/create", (req, res) => {
	res.send(req.query);
});

module.exports = expressRouter;
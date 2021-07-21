const express = require("express");
const expressRouter = express.Router();
const db = require("../../core/database");
const Hash = require("../../core/hash");
const Response = require("../../core/response");
const model = require("./model/account");

/**
 * CREATING ACCOUNT
 */
expressRouter.get("/create", async (req, res) => {
	const name = req.query.name;
	const email = req.query.email;
	const password = Hash.make(req.query.password);

	const accountId = await model.account.create({
		name: name,
		email: email,
		password: password
	}).id;

	const time = Date.now() + 3600 * 24 * 7;
	const token = Hash.make(`${accountId}.${time}.${Math.random()}`);

	model.accountSession.create({
		token: token,
		time: time,
		accountId: accountId
	}).then(() => {
		Response.success({token: token});
	});
});

expressRouter.get("/getAll", (req, res) => {
	model.account.findAll({raw:true}).then((res) => {
		Response.success({accounts: res});
	});
});

module.exports = expressRouter;
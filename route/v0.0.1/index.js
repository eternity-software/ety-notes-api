/**
 * Include needle dependents
 */
const express = require('express');
const expressRouter = express.Router();
const Router = require("../../core/Router");

/**
 * Create router instance
 * @type {Router}
 */
const router = new Router(expressRouter);

/**
 * Register methods
 */
router.get({
	url: "/account.create",
	controller: "Account",
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

module.exports = router.result();
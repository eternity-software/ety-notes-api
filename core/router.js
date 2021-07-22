require("colors");
const express = require("express");
const Response = require("./response");
let expressRouter = null;
let path = __dirname;

/**
 * Setup local path
 * @param localPath
 * @param {string} localPath
 */
const setup = (localPath) => {
	expressRouter = express.Router();
	path = localPath;
}

/**
 * New GET route
 * @param route
 */
const get = (route) => {
	console.log(`> Router register GET '${route.url}'`.cyan)
	expressRouter.get(route.url, (req) => {
		register(route, req.query);
	});
}

/**
 * New POST route
 * @param route
 */
const post = (route) => {
	console.log(`> Router register POST '${route.url}'`.cyan)
	expressRouter.post(route.url, (req) => {
		register(route, req.body);
	});
}

/**
 * Register new route
 * @param route
 * @param params
 */
const register = (route, params) => {
	if(paramsVerify(route.params, params) === true)
		handler(route.model, route.method, params);
}

/**
 * Check the received parameters
 * @param rules
 * @param req
 * @returns {*}
 */
const paramsVerify = (rules, req) => {
	for(let key in rules) {
		// If parameter with 'key' is missing
		if(!req[key]) {
			if(rules[key].required) return Response.error(400, `Parameter ${key} is missing.`);
			// Skip error
			continue;
		}

		// Define temp variable
		const rule = rules[key];
		const value = req[key];
		// Define main rules
		const regex = rule.regex || false;
		const minLength = rule.minLength || false;
		const maxLength = rule.maxLength || false;

		if(regex && !regex.test(value)) return Response.error(400, `Parameter ${key} does not match the required regex.`);
		if(minLength && value.length < minLength) return Response.error(400, `Parameter ${key} less ${minLength}`);
		if(maxLength && value.length > maxLength) return Response.error(400, `Parameter ${key} more ${maxLength}`);
	}

	return true;
}

/**
 * Request handler
 * @param model
 * @param method
 * @param params
 */
const handler = (model, method, params) => {
	console.log(`> Execute model ${model}->${method} `);
	try{
		const module = require(path + model);
		module[method](params);
	} catch (e) {
		return Response.error(500, e);
	}
}

/**
 * Getting result express Router
 * @returns {Router}
 */
const router = () => {
	return expressRouter;
}

module.exports = {setup, get, post, router};
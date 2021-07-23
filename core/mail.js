/**
 *  Include all dependents
 */
const nodemailer = require("nodemailer");
const config = require("../config/smtp.config");

let transporter = nodemailer.createTransport({
	host: config.host,
	port: config.port,
	secure: false,
	auth: {
		user: config.username,
		pass: config.password,
	},
});

module.exports = transporter;
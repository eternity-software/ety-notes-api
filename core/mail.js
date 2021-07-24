/**
 *  Include all dependents
 */
const nodemailer = require("nodemailer");
const config = require("../config/smtp.config");

/**
 * Get mail transporter
 * @returns {Promise<Mail>}
 */
module.exports = async() => {

	let transporter = nodemailer.createTransport({
		host: config.host,
		port: config.port,
		secure: config.ssl,
		auth: {
			user: config.username,
			pass: config.password
		},
	});

	return transporter;

};

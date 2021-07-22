require("colors");

const Sequelize = require("sequelize");
const config = require("../config/db.config");
const sequelize = new Sequelize(config.database, config.user, config.password, {
	dialect: config.driver,
	host: config.host,
	logging: false,
});

console.log(">> [DATABASE]: connected.".yellow);

module.exports = sequelize;
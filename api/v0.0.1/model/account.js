const Sequelize = require("sequelize");
const db = require("../../../core/database");

const Account = db.define("account", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	name: {
		type: Sequelize.STRING,
		minLength: 4,
		maxLength: 255,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		minLength: 4,
		maxLength: 255,
		allowNull: false
	},
	password: {
		type: Sequelize.STRING,
		minLength: 1,
		maxLength: 255,
		allowNull: false
	}
});

const AccountSession = db.define("account_session", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	token: {
		type: Sequelize.STRING,
		maxLength: 255,
		allowNull: false
	},
	time: {
		type: Sequelize.INTEGER,
		allowNull: false
	}
});

Account.hasMany(AccountSession);

module.exports = {
	account: Account,
	accountSession: AccountSession
}
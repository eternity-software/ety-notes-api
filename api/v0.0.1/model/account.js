const Sequelize = require("sequelize");
const db = require("../../../core/database");
const Hash = require("../../../core/hash");
const Response = require("../../../core/response");

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
	},
	activated: {
		type: Sequelize.ENUM("Y", "N"),
		defaultValue: "N",
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
	},
	activated: {
		type: Sequelize.ENUM("Y", "N"),
		defaultValue: "Y",
		allowNull: false
	}
});

const AccountVerifyCode = db.define("account_verify_code", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	code: {
		type: Sequelize.INTEGER,
		maxLength: 6,
		allowNull: false
	}
})

Account.hasMany(AccountSession);
Account.hasMany(AccountVerifyCode);

/**
 * Generate activation code
 * @param count
 */
const code_generate = (count = 6) => {
	const chars = "123456789";
	let result = "";
	for(let i = 0; i < count; i++){
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}

/**
 * Create account
 * @param name
 * @param email
 * @param password
 * @returns {Promise<void>}
 */
const create = async ({name, email, password}) => {
	// Hashing password
	password = Hash.make(password);
	// Find account with typed email
	if(await Account.findOne({ where: { email: email }, raw: true })) {
		return Response.error(400, "An account with this email is already registered");
	}
	// Create account to database
	Account.create({
		name: name,
		email: email,
		password: password
	}).then(async (res) => {
		let accountId = res.id;
		// Define time and hashing new token
		const time = Date.now() + 3600 * 24 * 7;
		const token = Hash.make(`${accountId}.${time}.${Math.random()}`);
		// Creating new token
		await AccountSession.create({
			token: token,
			time: time,
			accountId: accountId
		});
		// Generate activation code
		const code = code_generate();
		// Creating activation code
		await AccountVerifyCode.create({code: code, accountId: accountId}).then(() => {
			Response.success({token: token});
		});
	});
}

/**
 * Login account
 * @param email
 * @param password
 * @returns {Promise<void>}
 */
const login = async ({email, password}) => {
	// Find account with typed email
	let account;
	if( (account = await Account.findOne({ where: { email: email }, raw: true })) ) {
		if(!Hash.compare(password, account.password)){
			return Response.error(400, "Password is incorrect");
		}
		// Define time and hashing new token
		const time = Date.now() + 3600 * 24 * 7;
		const token = Hash.make(`${account.id}.${time}.${Math.random()}`);
		// Creating new token
		let result = await AccountSession.create({
			token: token,
			time: time,
			accountId: account.id
		});

		if(result){
			return Response.success({token: token});
		}
	}
	return Response.error(400, "The account with the specified email was not found");
}

/**
 * Authentication
 * @returns {Promise<void>}
 * @param token
 */
const auth = async (token) => {
	let session = await AccountSession.findOne({where: {token: token}, raw: true})
	if(session) {
		if(session.activated === "Y"){
			return await Account.findByPk(session.accountId);
		} else {
			return Response.error(400, "Token is expired");
		}
	}
	return Response.error(400, "Token is invalid");
}

/**
 * Get account info
 * @param token
 * @returns {Promise<void>}
 */
const getInfo = async ({token}) => {
	let account;
	if( (account = await auth(token)) ) {
		return Response.success({account: account});
	}
}

/**
 * Account activate
 * @param token
 * @param code
 * @returns {Promise<void>}
 */
const activate = async ({token, code}) => {
	let account = await auth(token);
	let verifyCode = await AccountVerifyCode.findOne({where: {code: code, accountId: account.id}, raw: true});
	if(verifyCode){
		await AccountVerifyCode.destroy({where: {id: verifyCode.id}});
		if(await Account.update({activated: "Y"}, {where: {id: account.id}})){
			return Response.success([]);
		}
	}
	return Response.error(400, "Invalid activation code");
}

/**
 * Account edit
 * @param token
 * @param name
 * @returns {Promise<void>}
 */
const edit = async ({token, name}) => {
	let account = await auth(token);
	if(await Account.update({name}, {where: {id: account.id}})){
		return Response.success([]);
	}
	return Response.error(400, "Invalid edit");
}

/**
 * Close session
 * @param token
 * @returns {Promise<void>}
 */
const logout = async ({token}) => {
	let session = await AccountSession.findOne({where: {token: token, activated: "Y"}, raw: true})
	if(session) {
		if(await AccountSession.update({activated: "N"}, {where: {id: session.id}})){
			return Response.success([]);
		}
	}
	return Response.error(400, "Invalid token");
}

/**
 * Account remove
 * @param token
 * @returns {Promise<void>}
 */
const remove = async ({token}) => {
	let account = await auth(token);
	let session = await AccountSession.destroy({where: {accountId: account.id}})
	if(session) {
		if(await Account.destroy({where: {id: account.id}})){
			return Response.success([]);
		}
	}
	return Response.error(400, "Invalid token");
}

module.exports = { create, login, auth, getInfo, activate, edit, logout, remove }
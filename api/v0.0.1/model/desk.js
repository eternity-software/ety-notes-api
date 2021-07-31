const sequelize = require("../../../core/database");
const { QueryTypes } = require('sequelize');
const models = require("./index");
const accountModel = require("./account");
const Response = require("../../../core/response");

/**
 * Check our rights to manage desk
 * @param token
 * @param deskId
 * @param onlyCreator
 * @returns {Promise<boolean>}
 */
const checkRights = async (token, deskId, onlyCreator = false) => {
	const account = await accountModel.auth(token, true);
	const ourMember = await models.DeskMember.findOne({where: {accountId: account.id, deskId: deskId}, raw: true});
	if(ourMember && ( (ourMember.type === "manager" && !onlyCreator) || ourMember.type === "creator") ){
		return true;
	}
	return Response.error(400, "Access is denied");
}

/**
 * Get member
 * @param token
 * @param deskId
 * @returns {Promise<boolean|void>}
 */
const getMember = async (token, deskId) => {
	const account = await accountModel.auth(token, true);
	const ourMember = await models.DeskMember.findOne({where: {accountId: account.id, deskId: deskId}, raw: true});
	if(ourMember){
		return true;
	}
	return Response.error(400, "Access is denied");
}

/**
 * Create desk
 * @param token
 * @param name
 * @param description
 */
const create = async ({token, name, description}) => {
	const account = (await accountModel.auth(token, true)) ?? false;
	if(account){
		models.Desk.create({name, description}).then((res) => {
			const deskId = res.id;
			models.DeskMember.create({type: "creator", accountId: account.id, deskId: deskId}).then(() => {
				return Response.success({deskId: deskId});
			})
		});
	}
}

/**
 * Get desk
 * @param token
 * @param id
 * @returns {Promise<void>}
 */
const get = async ({token, id}) => {
	// Check our rights for it
	const member = await getMember(token, id);
	if(member !== true) return member;
	const desk = await models.Desk.findOne({where: {id: id}, raw: true});
	if(desk) {
		return Response.success({desk: desk});
	}
}

/**
 * Edit desk
 * @param token
 * @param id
 * @param name
 * @param description
 */
const edit = async ({token, id, name, description}) => {
	// Check our rights for it
	if(!await checkRights(token, id, true)) return;

	if(await models.Desk.update({name, description}, {where: {id: id}})){
		return Response.success();
	}
	return Response.error(500, "Some wrong");
}

/**
 * Get desk list
 * @param token
 */
const getList = async ({token}) => {
	const account = await accountModel.auth(token, true);
	if(account){
		const desks = await sequelize.query(
			'SELECT * FROM desks, desk_members WHERE desk_members.accountId = :accountId AND desks.id = desk_members.deskId',
			{
				replacements: { accountId: account.id },
				type: QueryTypes.SELECT
			}
		);

		console.log(desks);
	
		if(desks) {
			return Response.success({desks: desks});
		}
	}
	return Response.error(500, "Some wrong");
}

/**
 * Get members
 * @param token
 * @param id
 * @returns {Promise<void>}
 */
const getMembers = async ({token, id}) => {
	// Check our rights for it
	if(await getMember(token, id) !== false) return;
	const members = await models.DeskMember.find({where: {deskId: id}, raw: true});
	if(members) {
		return Response.success({members: members});
	}
	return Response.error(500, "Some wrong");
}

/**
 * Add member to desk
 * @param token
 * @param deskId
 * @param accountId
 * @returns {Promise<void>}
 */
const addMember = async ({token, deskId, accountId}) => {
	// Check our rights for it
	if(!await checkRights(token, deskId, true)) return;
	if(await models.DeskMember.findOne({where: {accountId: accountId, deskId: deskId}})) {
		if (await models.DeskMember.create({type: "performer", accountId: accountId, deskId: deskId})) {
			return Response.success();
		}
		return Response.error(500, "Some wrong");
	}
	return Response.error(500, "He is already member");
}

/**
 * Add owner to desk
 * @param token
 * @param deskId
 * @param accountId
 * @returns {Promise<void>}
 */
const addManager = async ({token, deskId, accountId}) => {
	// Check our rights for it
	if(!await checkRights(token, deskId, true)) return;

	if(await models.DeskMember.findOne({where: {accountId: accountId, deskId: deskId}})) {
		if(await models.DeskMember.create({type: "manager", accountId: accountId, deskId: deskId})){
			return Response.success();
		}
		return Response.error(500, "Some wrong");
	}
	return Response.error(500, "He is already member");
}

/**
 * Remove desk
 * @param token
 * @param id
 * @returns {Promise<void>}
 */
const remove = async ({token, id}) => {
	// Check our rights for it
	if(!await checkRights(token, id, true)) return;

	if(await models.Desk.destroy({where: {id: id}})){
		return Response.success();
	}
	return Response.error(500, "Some wrong");
}

module.exports = { checkRights, getMember, create, get, edit, getList, getMembers, addMember, addManager, remove }
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
	const account = await accountModel.auth(token);
	const ourMember = await models.DeskMember.findOne({where: {accoundId: account.id, deskId: deskId}, raw: true});
	if(ourMember && ( (ourMember.type === "manager" && !onlyCreator) || ourMember.type === "creator") ){
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
	const account = await accountModel.auth(token);
	models.Desk.create({name, description}).then((res) => {
		const deskId = res.id;
		models.DeskMember.create({type: "creator", accountId: account.id, deskId: deskId}).then(() => {
			return Response.success({deskId: deskId});
		})
	});
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
	await checkRights(token, id);
	if(await models.Desk.update({name, description}, {where: {id: id}})){
		return Response.success();
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
	await checkRights(token, deskId);
	models.DeskMember.create({type: "performer", accountId: accountId, deskId: deskId}).then(() => {
		return Response.success();
	})
	return Response.error(500, "Some wrong");
}

/**
 * Add owner to desk
 * @param token
 * @param deskId
 * @param accountId
 * @returns {Promise<void>}
 */
const addOwner = async ({token, deskId, accountId}) => {
	// Check our rights for it
	await checkRights(token, deskId, true);
	models.DeskMember.create({type: "manager", accountId: accountId, deskId: deskId}).then(() => {
		return Response.success();
	})
	return Response.error(500, "Some wrong");
}

/**
 * Remove desk
 * @param token
 * @param id
 * @returns {Promise<void>}
 */
const remove = async ({token, id}) => {
	// Check our rights for it
	await checkRights(token, id, true);
	models.Desk.destroy({where: {id: id}}).then(() => {
		return Response.success();
	});
	return Response.error(500, "Some wrong");
}

module.exports = { checkRights, create, edit, addMember, addOwner, remove }
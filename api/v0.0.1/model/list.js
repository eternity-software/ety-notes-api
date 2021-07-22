const models = require("./index");
const accountModel = require("./account");
const deskModel = require("./desk");
const Response = require("../../../core/response");


/**
 * Check our rights to manage list
 * @param token
 * @param listId
 * @returns {Promise<boolean>}
 */
const checkRights = async (token, listId) => {
	const account = await accountModel.auth(token);
	const list = await models.List.findOne({where: {id: listId}, raw: true})

	if(list && list.accoundId === account.id){
		return true;
	}
	return Response.error(400, "Access is denied");
}

/**
 * Create desk
 * @param token
 * @param deskId
 * @param name
 * @param description
 */
const create = async ({token, deskId, name, description}) => {
	const account = await accountModel.auth(token);
	await deskModel.checkRights(token, deskId);
	models.List.create({name, description, deskId}).then((res) => {
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
	const list = await models.List.findOne({where: {id: id}, raw: true})
	if(list){
		await deskModel.checkRights(token, list.deskId);
		if(await models.Desk.update({name, description}, {where: {id: id}})){
			return Response.success();
		}
	}
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
	await checkRights(token, id);
	models.List.destroy({where: {id: id}}).then(() => {
		return Response.success();
	});
	return Response.error(500, "Some wrong");
}

module.exports = { checkRights, create, edit, remove }
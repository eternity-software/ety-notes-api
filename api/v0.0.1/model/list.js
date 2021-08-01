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
	//const list = await models.List.findOne({where: {id: listId}, raw: true})

	const ourMember = await models.List.findOne({where: {accountId: account.id, id: listId}, raw: true});
	if(ourMember){
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
	const accountId = account.id;
	let access = await deskModel.checkRights(token, deskId);
	if(access) {
		models.List.create({name, description, deskId, accountId}).then((res) => {
			return Response.success({listId: res.id});
		});
	}

	// Жопа, already sent exception
	//return Response.error(500, "Some wrong");
}

/**
 * Get list
 * @param token
 * @param id
 * @returns {Promise<void>}
 */
const get = async ({token, id}) => {
	// Избегаем попытки повторной отправки ответа
	let isSent = false;
	// Getting list
	const list = await models.List.findOne({where: {id: id}, raw: true});
	// If he fined
	if(list){
		// Checking rights
		if(await deskModel.getMember(token, list.deskId) !== true) return Response.error(500, "Access denied");
		return Response.success({list: list});
	}
	else
	{
		return Response.error(500, "List not found");
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
	// Избегаем попытки повторной отправки ответа
	let isSent = false;
	let access = await checkRights(token, id);
	if(access === true)
	{

		try {
			models.List.destroy({where: {id: id}}).then(() => {
				if (!isSent) {
					return Response.success();
				}

			});
		} catch (e) {
			isSent = true;
			return Response.error(500, "Some wrong");

		}
	}
}

module.exports = { checkRights, create, get, edit, remove }
const models = require("./index");
const accountModel = require("./account");
const deskModel = require("./desk");
const Response = require("../../../core/response");

/**
 * Create new task
 * @param token
 * @param listId
 * @param performerId
 * @param name
 * @param target
 * @param create_time
 * @param end_time
 * @returns {Promise<void>}
 */
const create = async ({token, listId, performerId, name, target, create_time, end_time}) => {
	// Getting list
	const list = await models.List.findOne({where: {id: listId}, raw: true});
	if(list){
		// Check rights
		if(await deskModel.checkRights(token, list.deskId) !== true) return Response.error(400, "Access denied");
		// Creating task
		models.Task.create({name, target, create_time, end_time, listId}).then(async (res) => {
			const taskId = res.id;
			// Creating performer
			if (await models.TaskPerformer.create({taskId, accountId: performerId})) {
				return Response.success({taskId: taskId});
			}
			return Response.error(500, "Something wrong");
		});
	}
	return Response.error(400, "List not found");
}

/**
 * Edit task
 * @param token
 * @param id
 * @param name
 * @param target
 * @param create_time
 * @param end_time
 * @returns {Promise<void>}
 */
const edit = async ({token, id, name, target, create_time, end_time}) => {
	// Getting task
	const task = await models.Task.findOne({where: {id: id}, raw: true});

	if(task) {
		// Getting list
		const list = await models.List.findOne({where: {id: task.listId}, raw: true});
		if(list) {
			// Check rights
			if(await deskModel.checkRights(token, list.deskId) !== true) return Response.error(400, "Access denied");
			// Update task
			if(await models.Task.update({name, target, create_time, end_time}, {where: {id: id}})){
				return Response.success();
			}
			return Response.error(500, "Something wrong");
		}
	}
	return Response.error(400, "Task not found");
}

/**
 * Add performer for task
 * @param token
 * @param taskId
 * @param accountId
 * @param position
 * @returns {Promise<void>}
 */
const addPerformer = async ({token, taskId, accountId, position}) => {
	// Getting task
	const task = await models.Task.findOne({where: {id: taskId}, raw: true});

	if(task) {
		// Getting list
		const list = await models.List.findOne({where: {id: task.listId}, raw: true});
		if(list) {
			// Check rights
			if(await deskModel.checkRights(token, list.deskId) !== true) return Response.error(400, "Access denied");
			// Adding performer
			if(await models.TaskPerformer.create({position, taskId, accountId})){
				return Response.success();
			}
			return Response.error(500, "Something wrong");
		}
	}
	return Response.error(400, "Task not found");
}

/**
 * Remove performer for task
 * @param token
 * @param taskId
 * @param accountId
 * @returns {Promise<void>}
 */
const removePerformer = async ({token, taskId, accountId}) => {
	// Getting task
	const task = await models.Task.findOne({where: {id: taskId}, raw: true});

	if(task) {
		// Getting list
		const list = await models.List.findOne({where: {id: task.listId}, raw: true});
		if(list) {
			// Check rights
			if(await deskModel.checkRights(token, list.deskId) !== true) return Response.error(400, "Access denied");
			// Removing performer
			if(await models.TaskPerformer.destroy({where: {taskId, accountId}})){
				return Response.success();
			}
			return Response.error(500, "Something wrong");
		}
	}
	return Response.error(400, "Task not found");
}

/**
 * Remove task
 * @param token
 * @param taskId
 */
const remove = async ({token, id}) => {
	// Getting task
	const task = await models.Task.findOne({where: {id: id}, raw: true});

	if(task) {
		// Getting list
		const list = await models.List.findOne({where: {id: task.listId}, raw: true});
		if(list) {
			// Check rights
			if(await deskModel.checkRights(token, list.deskId) !== true) return Response.error(400, "Access denied");
			// Removing performer
			if(await models.Task.destroy({where: {id: id}})){
				return Response.success();
			}
			return Response.error(500, "Something wrong");
		}
	}
	return Response.error(400, "Task not found");
}

/**
 * Done task
 * @param token
 * @param taskId
 */
const done = async ({token, id}) => {
	// Getting task
	const task = await models.Task.findOne({where: {id: id}, raw: true});

	if(task) {
		// Getting list
		const list = await models.List.findOne({where: {id: task.listId}, raw: true});
		if(list) {
			// Check rights
			if(await deskModel.checkRights(token, list.deskId) !== true) return Response.error(400, "Access denied");
			// Update task
			if(await models.Task.update({done: "Y"}, {where: {id: id}})){
				return Response.success();
			}
			return Response.error(500, "Something wrong");
		}
	}
	return Response.error(400, "Task not found");
}

module.exports = { create, edit, addPerformer, removePerformer, remove, done }
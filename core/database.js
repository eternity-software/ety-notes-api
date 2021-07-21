/**
 * Include all dependents
 */
const mysql = require('mysql2');
const colors = require("colors");
const Response = require("./response");

class Database {
	
	static config = require("../config/db.config");
	static pool = mysql.createPool(Database.config);

	/**
	 * Get connection to callback
	 * @param callback
	 */
	static getConnection(callback){
		Database.pool.getConnection((err, connection) => {
			if(err){
				console.error(`> [DATABASE]: ${err}`);
				Response.error(408, "Database connection timeout");
			}
			callback(connection);
		});
	}

	/**
	 * All query catch
	 * @param err
	 */
	static queryCatch = err => {
		console.error(`> [DATABASE] Query: ${err}`);
		Response.error(403, err);
	}

	/**
	 * Select SQL request
	 * @param table
	 * @param condition
	 * @param params
	 * @param callback
	 * @param fields
	 */
	static select(table, condition, params, callback, fields = "*"){
		// Define sql to select query
		const sql = `SELECT ${fields} FROM ${table} WHERE ${condition}`;
		console.log(`> [DATABASE] Making query: ${sql}`);
		// Get connection from pool
		Database.getConnection((connection) => {
			// Make query
			connection.promise().query(sql, params)
				.then(([rows, fields]) => {
					callback(rows, fields);
				})
				.catch((err) => {
					console.error(`[DATABASE] Query: ${err}`);
					Response.error(403, err);
				});
		});
	}

	/**
	 * Select all SQL request
	 * @param table
	 * @param callback
	 * @param fields
	 */
	static selectAll(table, callback, fields = "*"){
		// Define sql to select query
		const sql = `SELECT ${fields} FROM ${table}`;
		console.log(`> [DATABASE] Making query: ${sql}`);
		// Get connection from pool
		Database.getConnection((connection) => {
			// Make query
			connection.promise().query(sql)
				.then(([rows, fields]) => {
					callback(rows, fields);
				})
				.catch(Database.queryCatch);
		});
	}

	/**
	 * Insert into SQL request
	 * @param table
	 * @param sql_part
	 * @param callback
	 * @param params
	 */
	static insert(table, sql_part, callback, params = []){
		// Define sql to select query
		const sql = `INSERT INTO ${table} ${sql_part}`;
		console.log(`[DATABASE] Making query: ${sql}`);
		// Get connection from pool
		Database.getConnection((connection) => {
			// Make query
			connection.query(sql, params, (err, result) => {
				if (err) Database.queryCatch(err);
				callback(result.insertId);
			});
		});
	}
}

module.exports = Database;
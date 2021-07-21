/**
 * Include all dependents
 */
const mysql = require('mysql2');

class Database {
	/**
	 * Database constructor
	 */
	constructor() {
		this.config = require("../config/db.config");
		this.pool = mysql.createPool(this.config);
	}

	/**
	 * Setter for response
	 */
	setResponse(response){
		this.response = response;
	}

	/**
	 * Get connection to callback
	 * @param callback
	 */
	getConnection(callback){
		this.pool.getConnection((err, connection) => {
			if(err){
				console.log(`(DATABASE): ${err}`);
				this.response.error(408, "Database connection timeout");
			}
			callback(connection);
		});
	}

	/**
	 * All query catch
	 * @param err
	 */
	queryCatch = err => {
		console.log(`(DATABASE QUERY ERROR): ${err}`);
		this.response.error(403, err);
	}

	/**
	 * Select SQL request
	 * @param table
	 * @param condition
	 * @param params
	 * @param callback
	 * @param fields
	 */
	select(table, condition, params, callback, fields = "*"){
		// Define sql to select query
		const sql = `SELECT ${fields} FROM ${table} WHERE ${condition}`;
		console.log(`(DATABASE QUERY): ${sql}`);
		// Get connection from pool
		this.getConnection((connection) => {
			// Make query
			connection.promise().query(sql, params)
				.then(([rows, fields]) => {
					callback(rows, fields);
				})
				.catch((err) => {
					console.log(`(DATABASE QUERY ERROR): ${err}`);
					this.response.error(403, err);
				});
		});
	}

	/**
	 * Select all SQL request
	 * @param table
	 * @param callback
	 * @param fields
	 */
	selectAll(table, callback, fields = "*"){
		// Define sql to select query
		const sql = `SELECT ${fields} FROM ${table}`;
		console.log(`(DATABASE QUERY): ${sql}`);
		// Get connection from pool
		this.getConnection((connection) => {
			// Make query
			connection.promise().query(sql)
				.then(([rows, fields]) => {
					callback(rows, fields);
				})
				.catch(this.queryCatch);
		});
	}

	/**
	 * Insert into SQL request
	 * @param table
	 * @param sql_part
	 * @param callback
	 * @param params
	 */
	insert(table, sql_part, callback, params = []){
		// Define sql to select query
		const sql = `INSERT INTO ${table} ${sql_part}`;
		console.log(`(DATABASE QUERY): ${sql}`);
		// Get connection from pool
		this.getConnection((connection) => {
			// Make query
			connection.query(sql, params, (err, result) => {
				if (err) this.queryCatch(err);
				callback(result.insertId);
			});
		});
	}
}

module.exports = Database;
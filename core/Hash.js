/**
 * Include all dependents
 */
const bcrypt = require("bcrypt");

class Hash {
	/**
	 * Make hash
	 * @param data
	 * @param salt
	 */
	static make(data, salt = 16){
		return bcrypt.hashSync(data, salt);
	}

	/**
	 * Compare hash
	 * @param data
	 * @param hash
	 * @returns {*}
	 */
	static compare(data, hash){
		return bcrypt.compareSync(data, hash);
	}
}

module.exports = Hash;
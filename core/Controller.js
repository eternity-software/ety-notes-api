/**
 * Parent class of all controllers
 */
class Controller {

	/**
	 * Controller constructor
	 * @param {Object} props
	 */
	constructor(props) {
		// Response sender
		this.response = props.response;
	}

}

module.exports = Controller;
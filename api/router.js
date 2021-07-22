const fs = require("fs");
const colors = require("colors");

module.exports = (app, version) => {
	console.log("\n>> Router initialization..".yellow);

	const routePath = (path = "/") => {

		fs.readdirSync(path).forEach(function(item) {
			if(item === "router.js") return;

			const pathFile = `${path}/${item}`;
			const stat = fs.statSync(pathFile);

			if(stat.isDirectory()){
				if(item === "model"){
					require(pathFile+"/index");
				} else {
					routePath(`/${item}`);
				}
			} else {
				item = item.split(".")[0];
				const requestAddress = "/" + item + "/";
				console.log(`> Registering new route: ${requestAddress} BY .${path}/${item}`.cyan);
				app.use(requestAddress, require(`${path}/${item}`));
			}
		});
	}

	routePath(__dirname + "/v" + version);
}
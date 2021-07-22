const fs = require("fs");
const colors = require("colors");

module.exports = app => {
	console.log("\n>> Router initialization..".yellow);

	const routePath = (path = "/") => {
		const pathDir = __dirname + path;
		fs.readdirSync(pathDir).forEach(function(item) {
			if(item === "router.js") return;

			const pathFile = `${pathDir}/${item}`;
			const stat = fs.statSync(pathFile);

			if(stat.isDirectory()){
				if(item === "model"){
					require(pathFile+"/index");
				} else {
					routePath(`/${item}`);
				}
			} else {
				item = item.split(".")[0];
				const requestAddress = path.replace(/\./gmi, "") + "/" + item + "/";
				console.log(`> Registering new route: ${requestAddress} BY .${path}/${item}`.cyan);
				app.use(requestAddress, require(`.${path}/${item}`));
			}
		});
	}

	routePath();
}
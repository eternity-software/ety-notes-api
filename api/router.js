const fs = require("fs");
const colors = require("colors");
const express = require("express");
const expressRouter = express.Router();

console.log("\n>> Router initialization..".yellow);

const routePath = (path = "") => {
	const pathDir = __dirname + path;

	fs.readdirSync(pathDir).map((item) => {
		if(item === "router.js") return;

		const pathFile = `${pathDir}/${item}`;
		const stat = fs.statSync(pathFile);

		if(stat.isDirectory()){
			if(item === "model"){
				defineModels(pathFile)
			} else {
				routePath(`/${item}`);
			}
		} else {
			const requestAddress = path.replace(/\./gmi, "") + "/" + item.split(".")[0];
			console.log(`> Registering new route: ${requestAddress} BY ${pathFile}`.cyan);
			expressRouter.use(requestAddress, require(`${pathFile}`));
		}
	});
}

const defineModels = (path = "") => {
	fs.readdirSync(path).map((item) => {
		const pathFile = `${path}/${item}`;
		const stat = fs.statSync(pathFile);

		if(stat.isFile()){
			require(pathFile);
		}
	});
}

routePath();

module.exports = expressRouter;
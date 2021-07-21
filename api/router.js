const fs = require("fs");
const express = require("express");
const expressRouter = express.Router();

const routePath = (path = "") => {
	const pathDir = __dirname + path;

	fs.readdirSync(pathDir).map((item) => {
		if(item === "router.js") return;

		const pathFile = `${pathDir}/${item}`;
		const stat = fs.statSync(pathFile);

		if(stat.isDirectory()){
			routePath(`/${item}`);
		} else {
			console.log(`(NEW ROUTE): ${path}/${item} BY ${pathFile}`)
			expressRouter.use(`${path}/${item.split(".")[0]}`, require(`${pathFile}`));
		}
	});
}

routePath();

module.exports = expressRouter;
const http = require("http");
const express = require("express");
const morgan = require('morgan');
const app_config = require("./config/app.config");

const logger = morgan('dev');

const app = express();

app.all(/(.*)/,(req, res) => {
	const version = (req.query.v) ?? app_config.version;
	(require(`./route/v${version}/index`))(req, res);
});

app.use(logger);

const server = http.createServer(app);

server.listen(80);
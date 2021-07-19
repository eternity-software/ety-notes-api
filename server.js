/**
 * Include all dependents
 */
const http = require("http");
const express = require("express");
const morgan = require('morgan');

// Include application configuration
const app_config = require("./config/app.config");
// Create logger instance with dev modification
const logger = morgan('dev');
// Create express instance
const app = express();

// Include the default logger
app.use(logger);
// Include needle version router
app.use((req, res, next) => {
	const version = (req.query.v) ?? app_config.version;
	const router = require(`./route/v${version}/index`);
	app.use("/", router);
	next();
});

// Create server
const server = http.createServer(app);
// Start up on 80 port
server.listen(80);
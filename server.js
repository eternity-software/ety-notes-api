// Registering timer
const timeLabel = "> Server startup";
console.time(timeLabel)

/**
 * Include all dependents
 */
const http = require("http");
const express = require("express");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const colors = require("colors");
const Response = require("./core/response");
const Database = require("./core/database");
const app_config = require("./config/app.config");

// Create logger instance with dev modification
const logger = morgan('dev');
// Create express instance
const app = express();
// Sync database models
Database.sync().then(() => console.log("> Database synced".cyan));

// Include the default logger
app.use(logger);
// Include body-parser for converting request to json
app.use(bodyParser.urlencoded({ extended: true }));

let version = false;
app.use((req, res, next) => {
	// Set version
	version = req.query.v;
	// Set response for Response
	Response.set(res);
	// Go to next routes
	next();
});

// Connect all routes (and all versions)
require("./api/router")(app, version ? version : app_config.version);

const server = http.createServer(app);
server.listen(80, () => {
	console.log("\n---- SERVER STARTED ----\n".green);
	console.log(">> etyNotes API, 2021 ")
	console.timeLog(timeLabel);
});
/**
 * Include all dependents
 */
const http = require("http");
const express = require("express");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const Response = require("./core/response");
const Database = require("./core/database");

// Registering timer
const timeLabel = "> Server startup"
console.time(timeLabel)

// Include application configuration
const app_config = require("./config/app.config");
// Create logger instance with dev modification
const logger = morgan('dev');
// Create express instance
const app = express();
// Create Database instance
const database = new Database();
// Create Response instance
const response = new Response();

// Include the default logger
app.use(logger);
// Include body-parser for converting request to json
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	// Set response for Response
	response.set(res);
	// Set response for Database
	database.setResponse(response);
	// Go to next routes
	next();
});

// Connect all routes (and all versions)
app.use("/", require("./api/router"));

const server = http.createServer(app);
server.listen(80, () => {
	console.log("\n---- SERVER STARTED ----\n");
	console.log(">> etyNotes API, 2021 ")
	console.timeLog(timeLabel);
});
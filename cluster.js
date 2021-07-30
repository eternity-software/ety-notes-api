const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const pid = process.pid;

if (cluster.isMaster) {
	console.log(`CPUs: ${numCPUs}`);
	console.log(`Master started. Pid: ${pid}`);
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`);
		cluster.fork();
	});
}

if(cluster.isWorker){
	require("./worker");
}
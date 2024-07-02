const cluster = require('cluster');
const os = require('os');
const logger = require('./utils/logger');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    logger.info(`Number of CPUs: ${numCPUs}`);
    logger.info(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        logger.info(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    require('./server');
    logger.info(`Worker ${process.pid} started`);
}

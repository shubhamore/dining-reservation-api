const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const db = require('./models');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const limiter = rateLimit({
    windowMs: 5 * 1000,
    max: 5 
});

app.use(cors());
app.use(helmet());
app.use(limiter);
// app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync()
    .then(() => {
        logger.info('Database synchronized successfully.');
    })
    .catch((err) => {
        logger.error('Failed to synchronize database: ', err);
    });

app.get('/', (req, res) => {
    logger.info(`Process=${process.pid} is handling the request.`);
    res.send(`Hello World from process ${process.pid}`);
});

app.use('/api', require('./routes/index.routes'));

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
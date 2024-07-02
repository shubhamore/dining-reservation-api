const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config.js');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model.js')(sequelize, DataTypes);
db.Place = require('./place.model.js')(sequelize, DataTypes);
db.Reservation = require('./reservation.model.js')(sequelize, DataTypes);



module.exports = db;

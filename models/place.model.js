module.exports = (sequelize, DataTypes) => {
    const Place = sequelize.define('Place', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      phone_no: {
        type: DataTypes.STRING,
        allowNull: false
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true
      },
      operational_hours: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
          open_time: "08:00:00",
          close_time: "23:00:00"
        }
      },
      booked_slots: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: true,
      tableName: 'places'
    });
  
    Place.associate = (models) => {
      Place.hasMany(models.Reservation, { foreignKey: 'placeId' });
    };
  
    return Place;
  };
  
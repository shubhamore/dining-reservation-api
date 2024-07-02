module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      placeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'places',
          key: 'id'
        }
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false
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
      tableName: 'reservations',
      indexes: [
        {
          unique: true,
          fields: ['placeId', 'startTime', 'endTime']
        }
      ]
    });
  
    Reservation.associate = (models) => {
      Reservation.belongsTo(models.User, { foreignKey: 'userId' });
      Reservation.belongsTo(models.Place, { foreignKey: 'placeId' });
    };
  
    return Reservation;
  };
  
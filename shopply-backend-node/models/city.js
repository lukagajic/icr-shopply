const database = require('../configuration/dbConnection');
const Sequelize = require('sequelize');

const City = database.define('City', {
    cityId: {
        field: 'city_id',
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }
}, {
    tableName: 'city'
});

module.exports = City;

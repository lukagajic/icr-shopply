const database = require('../configuration/dbConnection');
const Sequelize = require('sequelize');

const Feature = database.define('Feature', {
    featureId: {
        field: 'feature_id',
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    categoryId: {
        field: 'category_id',
        type: Sequelize.INTEGER.UNSIGNED
    }
}, {
    tableName: 'feature'
});

module.exports = Feature;

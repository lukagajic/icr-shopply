const database = require('../configuration/dbConnection');
const Sequelize = require('sequelize');

const City = require('./city');

const User = database.define('User', {
    userId: {
        field: 'user_id',
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true
    },
    forename: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'password_hash'
    },
    bornAt: {
        type: Sequelize.DATE,
        field: 'born_at'
    },
    gender: {
        type: Sequelize.ENUM,
        values: ['Male', 'Female'],
        allowNull: false
    },
    role: {
        type: Sequelize.ENUM,
        values: ['user', 'admin']
    },
    address: {
        type: Sequelize.STRING
    },
    postalCode: {
        field: 'postal_code',
        type: Sequelize.INTEGER.UNSIGNED
    },
    cityId: {
        field: 'city_id',
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
            model: 'City',
            key: 'city_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    }
}, {
    tableName: 'user'
});

User.belongsTo(City, {
    as: 'city',
    foreignKey: 'city_id'
})

module.exports = User;
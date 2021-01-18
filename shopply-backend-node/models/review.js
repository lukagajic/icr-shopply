const database = require('../configuration/dbConnection');
const Sequelize = require('sequelize');
const User = require('../models/user');

const Review = database.define('Review', {
    reviewId: {
        field: 'review_id',
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true
    },
    satisfaction: {
        type: Sequelize.ENUM,
        values: ['positive', 'negative'],
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'created_at'
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    userId: {
        field: 'user_id',
        type: Sequelize.INTEGER.UNSIGNED
    },
    productId: {
        field: 'product_id',
        type: Sequelize.INTEGER.UNSIGNED
    }
}, {
    tableName: 'review'
});

Review.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id'
});

module.exports = Review;

const database = require('../configuration/dbConnection');
const Sequelize = require('sequelize');

const Product = database.define('Product', {
    productId: {
        field: 'product_id',
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    shortDescription: {
        type: Sequelize.STRING,
        field: 'short_description',
        unique: true
    },
    description: {
        type: Sequelize.TEXT,
        unique: true,
        allowNull: false
    },
    photoPath: {
        type: Sequelize.STRING,
        field: 'photo_path',
        allowNull: false
    },
    categoryId: {
        type: Sequelize.INTEGER.UNSIGNED,
        field: 'category_id',
        allowNull: false
    },
    price: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
    isFeatured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        field: 'is_featured'
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'created_at'
    }
}, {
    tableName: 'product'
});

module.exports = Product;

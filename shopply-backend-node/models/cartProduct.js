const database = require('../configuration/dbConnection');
const Sequelize = require('sequelize');
const Product = require('./product');

const CartProduct = database.define('CartProduct', {
    cartProductId: {
        field: 'cart_product_id',
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    cartId: {
        field: 'cart_id',
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
    productId: {
        field: 'product_id',
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    tableName: 'cart_product'
});

CartProduct.belongsTo(Product, {
    as: 'product',
    foreignKey: 'product_id'
});

module.exports = CartProduct;

const database = require('../configuration/dbConnection');
const Sequelize = require('sequelize');
const Cart = require('../models/cart');

const Order = database.define('Order', {
    orderId: {
        field: 'order_id',
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'created_at'
    },
    cartId: {
        field: 'cart_id',
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM,
        values: ['pending', 'accepted', 'rejected']
    },
    rating: {
        type: Sequelize.INTEGER.UNSIGNED
    }
}, {
    tableName: 'order'
});

Order.belongsTo(Cart, {
    as: 'cart',
    foreignKey: 'cart_id'
});

Cart.hasMany(Order, {
    as: 'orders',
    foreignKey: 'cart_id'
});

module.exports = Order;

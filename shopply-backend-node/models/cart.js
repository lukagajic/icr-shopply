const database = require('../configuration/dbConnection');
const Sequelize = require('sequelize');

const CartProduct = require('./cartProduct');
const User = require('./user');

const Cart = database.define('Cart', {
    cartId: {
        field: 'cart_id',
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        field: 'user_id',
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'created_at'
    }
}, {
    tableName: 'cart'
});

Cart.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id'
});

User.hasMany(Cart, {
    as: 'carts',
    foreignKey: 'user_id'
});

CartProduct.belongsTo(Cart, {
    as: 'cart',
    foreignKey: 'cart_id'
});

Cart.hasMany(CartProduct, {
    as: 'cartProducts',
    foreignKey: 'cart_id'
});

module.exports = Cart;

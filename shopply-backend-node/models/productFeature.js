const database = require('../configuration/dbConnection');
const Sequelize = require('sequelize');

const Feature = require('./feature');
const Product = require('./product');

const ProductFeature = database.define('ProductFeature', {
    productFeatureId: {
        field: 'product_feature_id',
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true
    },
    productId: {
        field: 'product_id',
        type: Sequelize.INTEGER.UNSIGNED
    },
    featureId: {
        field: 'feature_id',
        type: Sequelize.INTEGER.UNSIGNED
    },
    value: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    tableName: 'product_feature'
});

ProductFeature.belongsTo(Product, {
    as: 'product',
    foreignKey: 'product_id'
});

ProductFeature.belongsTo(Feature, {
    as: 'feature',
    foreignKey: 'feature_id'
});

Product.hasMany(ProductFeature, {
    as: 'productFeatures',
    foreignKey: 'product_id'
});

module.exports = ProductFeature;

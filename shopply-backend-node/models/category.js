const database = require('../configuration/dbConnection');
const Sequelize = require('sequelize');

const Category = database.define('Category', {
    categoryId: {
        field: 'category_id',
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    photoPath: {
        type: Sequelize.STRING,
        field: 'photo_path',
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        field: 'created_at'
    },
    parentCategoryId: {
        field: 'parent__category_id',
        type: Sequelize.INTEGER.UNSIGNED
    }
}, {
    tableName: 'category'
});

Category.belongsTo(Category, {
    as: 'parentCategory',
    foreignKey: 'parent__category_id'
});

module.exports = Category;

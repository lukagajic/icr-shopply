const Category = require('../models/category');
const Product = require('../models/product');

module.exports = {
    async getAllCategories(req, res) {
        try {
            const categories = await Category.findAll({
                include: 'parentCategory'
                
            });
            res.json(categories);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async getCategoryById(req, res) {
        try {
            const { categoryId } = req.params;
            const category = await Category.findOne({
                where: {
                    categoryId: categoryId
                }
            });

            res.status(200).json(category);

        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getProductsForCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const products = await Product.findAll({
                where: {
                    categoryId: categoryId
                }
            });
            res.status(200).json(products); 
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async getSubcategoriesForCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const subcategories = await Category.findAll({
                where: {
                    parentCategoryId: categoryId
                }
            });
            res.status(200).json(subcategories);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
}

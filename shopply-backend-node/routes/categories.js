const express = require('express');
const router = express.Router();

const categoryController =  require('../controllers/categoryController');
const featureController = require('../controllers/featureController');

router.get('/', categoryController.getAllCategories);
router.get('/:categoryId', categoryController.getCategoryById);
router.get('/:categoryId/products', categoryController.getProductsForCategory);
router.get('/:categoryId/subcategories', categoryController.getSubcategoriesForCategory);
router.get('/:categoryId/features', featureController.getAllFeatureValuesForCategory);

module.exports = router;

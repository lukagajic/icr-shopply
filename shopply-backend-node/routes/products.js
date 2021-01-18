const express = require('express');
const router = express.Router();

const productController =  require('../controllers/productController');
const reviewController = require('../controllers/reviewController');
const featureController = require('../controllers/featureController');

router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/latest', productController.getLatestProducts);
router.post('/search', productController.searchForProducts);
router.get('/:productId', productController.getProductById);

router.get('/:productId/reviews', reviewController.getReviewsForProduct);
router.get('/:productId/features', featureController.getFeaturesForProduct);

module.exports = router;

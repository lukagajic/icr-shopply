const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/checkLogin');

const userController =  require('../controllers/userController');
const orderController = require('../controllers/orderController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');

router.get('/', userController.getAllUsers);
router.get('/profile', checkLogin, userController.getUserProfile);
router.patch('/password', checkLogin, userController.changePassword);


router.patch('/orders/rate', checkLogin, orderController.rateAnOrder);
router.post('/orders', checkLogin, orderController.createOrderForUser);
router.get('/orders', checkLogin, orderController.getOrdersForUser);

router.post('/cart', checkLogin, productController.addProductToCartForUser);
router.patch('/cart', checkLogin, cartController.updateQuantity);
router.get('/cart', checkLogin, cartController.getLatestCartForUser);

router.get('/:userId', userController.getUserById);
router.put('/profile', checkLogin, userController.updateProfile);



module.exports = router;

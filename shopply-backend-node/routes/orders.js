const express = require('express');
const router = express.Router();

const checkAdmin = require('../middlewares/checkAdmin');

const orderController =  require('../controllers/orderController');

router.get('/', checkAdmin, orderController.getAllOrders);
router.patch('/:orderId/updateStatus', checkAdmin, orderController.updateOrder);

module.exports = router;

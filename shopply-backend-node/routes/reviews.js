const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');
const checkLogin = require('../middlewares/checkLogin');

router.post('/', checkLogin, reviewController.addReview);

module.exports = router;

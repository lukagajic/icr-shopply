const express = require('express');
const router = express.Router();

const dialogflowController = require('../controllers/dialogflowController');

// TODO: Obrisati ovu rutu kad se deploy!
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'DialogFlow ruta radi!'
    });
});

router.post('/', express.json(), dialogflowController.handleFullfilments);

module.exports = router;

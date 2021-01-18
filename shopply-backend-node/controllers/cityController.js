const City = require('../models/city');

module.exports = {
    async getAllCities(req, res) {
        try {
            const cities = await City.findAll();
            res.json(cities);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
}

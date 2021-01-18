const Review = require('../models/review');

module.exports = {
    async addReview(req, res) {
        const { userId } = req.userData;

        try {
            const newReview = await Review.create({
                userId: userId,
                satisfaction: req.body.satisfaction,
                content: req.body.content,
                productId: req.body.productId
            });
            
            res.status(200).json(newReview);
            
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    
    async getReviewsForProduct(req, res) {
        try {
            const { productId } = req.params;
            const reviews = await Review.findAll({
                where: {
                    productId: productId
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                include: 'user'
            });
            res.status(200).json(reviews);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
}

const Feature = require('../models/feature');
const ProductFeature = require('../models/productFeature');

module.exports = {
    async getAllFeatureValuesForCategory(req, res) {
        try {
            const { categoryId } = req.params;
            
            const features = await Feature.findAll({
                where: {
                    categoryId: categoryId
                }
            });
            

            for (feature of features) {
                let featureValues = await ProductFeature.findAll({
                    where: {
                        featureId: feature.dataValues.featureId
                    }
                });

                featureValues = featureValues.map(featureValue => {
                    return featureValue.dataValues.value
                });

                feature.dataValues.values = featureValues
            }

            res.status(200).json(features);

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async getFeaturesForProduct(req, res) {
        try {
            const { productId } = req.params;

            const productFeatures = await ProductFeature.findAll({
                where: {
                    productId: productId
                },
                include: 'feature'
            });

            res.status(200).json(productFeatures);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
}

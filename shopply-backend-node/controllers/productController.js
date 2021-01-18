const Product = require('../models/product');
const Cart = require('../models/cart');
const CartProduct = require('../models/cartProduct');
const Order = require('../models/order');

module.exports = {

    async getAllProducts(req, res) {
        try {
            const products = await Product.findAll();
            res.status(200).json(products);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async getProductById(req, res) {
        try {
            const { productId } = req.params;
            const product = await Product.findOne({
                where: {
                    productId: productId
                }
            });
            res.status(200).json(product);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async getLatestProducts(req, res) {
        try {
            const latestProducts = await Product.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: 5
            });
            res.status(200).json(latestProducts);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async getFeaturedProducts(req, res) {
        try {
            const featuredProducts = await Product.findAll({
                where: {
                    isFeatured: true
                },
                limit: 5
            });

            res.status(200).json(featuredProducts);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async addProductToCartForUser(req, res) {
        try {

            const { productId, quantity } = req.body;

            const latestCart = await Cart.findAll({
                where: {
                    userId: req.userData.userId
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [{
                    model: CartProduct,
                    as: 'cartProducts',
                    include: 'product'
                }, {
                    model: Order,
                    as: 'orders'
                }],
                limit: 1
            });

            console.log(latestCart);

            if (latestCart.length === 0 || latestCart[0].dataValues.orders.length > 0) {

                console.log('USLI SMO OVDE');

                const newCart = await Cart.create({
                    userId: req.userData.userId
                });

                const newCartId = newCart.dataValues.cartId;

                const newCartProduct = await CartProduct.create({
                    cartId: newCartId,
                    productId: productId,
                    quantity: quantity
                });

                return res.status(200).json(newCartProduct);
            }

            const foundCartProduct = await CartProduct.findOne({
                where: {
                    cartId: latestCart[0].dataValues.cartId,
                    productId: productId
                }
            });

            if (!foundCartProduct) {
                const newCartProduct = await CartProduct.create({
                    cartId: latestCart[0].dataValues.cartId,
                    productId: productId,
                    quantity: quantity
                });

                return res.status(200).json(newCartProduct);
            }

            const updatedCartProduct = await CartProduct.update({ quantity: foundCartProduct.dataValues.quantity += quantity }, {
                where: {
                    cartProductId: foundCartProduct.dataValues.cartProductId
                }
            });

            res.status(200).json(
                await CartProduct.findOne({
                    where: {
                        cartProductId: foundCartProduct.dataValues.cartProductId
                    }
                })
            );
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async searchForProducts(req, res) {
        try {
            let products = await Product.findAll({
                where: {
                    categoryId: req.body.categoryId
                },
                include: 'productFeatures'
            });

            

            if (req.body.minPrice && req.body.maxPrice) {
                products = products.filter(product => product.dataValues.price > req.body.minPrice && product.dataValues.price < req.body.maxPrice);
            }

            if (req.body.minPrice) {
                products = products.filter(product => product.dataValues.price > req.body.minPrice);
            }

            if (req.body.maxPrice) {
                products = products.filter(product => product.dataValues.price < req.body.maxPrice);
            }
            
            const { categoryFeatures } = req.body;

            
            for (categoryFeature of categoryFeatures) {
                products = products.filter(product => product.dataValues.productFeatures.some(
                    productFeature => productFeature.dataValues.featureId == categoryFeature.id && productFeature.dataValues.value == categoryFeature.value                    
                ));
            }

            if (products.length === 0) {
                return res.status(200).json(await Product.findAll({
                    where: {
                        categoryId: req.body.categoryId
                    }
                }));
            }

            res.status(200).json(products);

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

}

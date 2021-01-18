const Cart = require('../models/cart');
const CartProduct = require('../models/cartProduct');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

module.exports = {
    async getAllOrders(req, res) {
        try {
            const allOrders = await Order.findAll({
                include: {
                    model: Cart,
                    as: 'cart',
                    include: [{
                        model: User,
                        as: 'user'
                    }, {
                        model: CartProduct,
                        as: 'cartProducts',
                        include: {
                            model: Product,
                            as: 'product'
                        }
                    }]
                },
                order: [
                    ['createdAt', 'DESC']
                ]
            });
            res.status(200).json(allOrders)
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async createOrderForUser(req, res) {
        const { cartId } = req.body;

        const foundOrder = await Order.findOne({
            where: {
                cartId: cartId
            }
        });

        if (foundOrder) {
            return res.json({
                success: false,
                message: 'Porudzbina vec postoji!'
            });
        }

        const foundCart = await Cart.findOne({
            where: {
                cartId: cartId
            },
            include: [{
                model: CartProduct,
                as: 'cartProducts',
                include: 'product'
            }]
        });

        if (!foundCart) {
            return res.json({
                success: false,
                message: 'Korpa ne postoji!'
            });
        }

        console.log();

        if (foundCart.dataValues.cartProducts.length === 0) {
            return res.json({
                success: false,
                message: 'Korpa je prazna!'
            })
        }

        const newOrder = await Order.create({
            cartId: cartId
        });

        return res.status(200).json({
            success: true,
            message: 'Porudžbina uspešno napravljena'
        });
    },

    async getOrdersForUser(req, res) {
        const { userId } = req.userData;

        const orders = await Order.findAll({
            include: {
                model: Cart,
                as: 'cart',
                include: {
                    model: CartProduct,
                    as: 'cartProducts',
                    include: 'product'
                },
                where: {
                    userId: userId
                }
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });

        res.status(200).json(orders);
    },

    async rateAnOrder(req, res) {
        try {
            const { userId } = req.userData;
            const { orderId, rating } = req.body;

            const foundOrder = await Order.findOne({
                where: {
                    orderId: orderId
                },
                include: 'cart'
            });

            if (!foundOrder) {
                return res.json({
                    success: false,
                    message: 'Ne postoji tražena porudžbina'
                })
            }

            if (rating < 1 || rating > 5) {
                return res.json({
                    success: false,
                    message: 'Uneta vrednost ocene nije u dozvoljenom opsegu (1-5)'
                });
            }

            if (foundOrder.dataValues.status !== 'accepted') {
                return res.json({
                    success: false,
                    message: 'Možete ocenjivati samo prihvaćene porudžbine'
                });
            }

            if (foundOrder.dataValues.rating > 0) {
                return res.json({
                    success: false,
                    message: 'Porudžbina je već ocenjena'
                });
            }

            if (foundOrder.dataValues.cart.dataValues.userId !== userId) {
                return res.json({
                    success: false,
                    message: 'Ne možete oceniti tuđu porudžbinu'
                });
            }

            await Order.update({
                rating: rating
            }, {
                where: {
                    orderId: orderId
                }
            });

            res.status(200).json({
                success: true,
                message: 'Porudžbina uspešno ocenjena',                
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async updateOrder(req, res) {
        try {
            const { orderId } = req.params;
            const { status } = req.body;

            if (status === 'pending' || status === 'accepted' || status === 'rejected') {
                await Order.update({ status: status }, {
                    where: {
                        orderId: orderId
                    }
                });
    
                return res.status(200).json({
                    success: true,
                    message: 'Status porudžbine uspešno promenjen!'
                });
            }

            res.json({
                success: false,
                message: 'Izabrali ste nepostojeći status!'
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
}

const CartProduct = require('../models/cartProduct');
const Cart = require('../models/cart');
const Order = require('../models/order');

module.exports = {
    async updateQuantity(req, res) {
        const { productId, cartId, quantity } = req.body;

        const cartProduct = await CartProduct.findOne({
            where: {
                cartId: cartId,
                productId: productId
            }
        });

        if (cartProduct) {
            console.log(cartProduct);

            if (quantity == 0)  {
                await cartProduct.destroy();
                
                return res.json({
                    success: true,
                    message: 'Uspesno ste uklonili proizvod iz korpe korpu!'
                });
            }

            await CartProduct.update({
                quantity: quantity
            }, {
                where: {
                    cartId: cartId,
                    productId: productId
                }
            });
            return res.json({
                success: true,
                message: 'Uspesno ste azurirali korpu!'
            });
        }

        res.status(404).json({
            success: false,
            message: 'Trazena korpa ne postoji!'
        });
    },

    async getLatestCartForUser(req, res) {
        try {
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

            if (latestCart.length === 0) {
                const newCart = await Cart.create({
                    userId: req.userData.userId
                });

                return res.status(200).json(newCart);
            }

            if (latestCart[0].dataValues.orders.length > 0) {
                return res.status(200).json(null);
            }
            console.log(latestCart);

            res.status(200).json(latestCart[0]);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

}

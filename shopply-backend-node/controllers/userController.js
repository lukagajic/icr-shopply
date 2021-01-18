const User = require('../models/user');
const Cart = require('../models/cart');
const CartProduct = require('../models/cartProduct');

const bcrypt = require('bcrypt');

const Order = require('../models/order');
const { TransactionRequirements } = require('actions-on-google');

module.exports = {
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async getUserProfile(req, res) {
        const { userId } = req.userData;

        try {
            const user = await User.findOne({
                attributes: { exclude: ['passwordHash'] },
                where: {
                    userId: userId
                },
                include: 'city'
            });

            res.status(200).json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async getUserById(req, res) {
        const { userId } = req.params;
        try {
            const user = await User.findOne({
                where: {
                    userId: userId
                },
                include: 'city'
            });

            res.status(200).json(user);

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async changePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            const { userId } = req.userData;

            if (oldPassword.length < 6 || newPassword.length < 6) {
                return res.json({
                    success: false,
                    message: 'Lozinke moraju da imaju minimum 6 karaktera!'
                });
            }

            if (oldPassword === newPassword) {
                return res.json({
                    success: false,
                    message: 'Stara i nova lozinka su iste!'
                });
            }

            const foundUser = await User.findOne({
                where: {
                    userId: userId
                }
            });

            if (!foundUser) {
                return res.json({
                    success: false,
                    message: 'Traženi korisnik ne postoji!'
                });
            }

            let arePasswordsEqual = await bcrypt.compare(oldPassword, foundUser.dataValues.passwordHash);

            if (!arePasswordsEqual) {
                return res.json({
                    success: false,
                    message: 'Uneta stara lozinka je netačna'
                });
            }

            const updatedUser = await User.update({
                passwordHash: bcrypt.hashSync(newPassword, 10)
            }, {
                where: {
                    userId: userId
                }
            });

            res.json({
                success: true,
                message: 'Lozinka uspešno promenjena!'
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async updateProfile(req, res) {
        try {
            const { userId } = req.userData;

            const { email } = req.body;

            const user = await User.findOne({
                where: {
                    email: email
                }
            });

            if (user.dataValues.userId !== userId) {
                return res.json({
                    success: false,
                    message: 'Korisnik sa tom e-mail adresom već postoji!'
                });
            }

            await User.update({ ...req.body }, {
                where: {
                    userId: userId
                }
            });

            res.json({
                success: true,
                message: 'Profil uspešno izmenjen'
            });

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
}

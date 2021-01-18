const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authConfig = require('../configuration/authConfig');
const { TransactionRequirements } = require('actions-on-google');

module.exports = {
    async register(req, res) {
        try {
            const { email } = req.body;

            const user = await User.findOne({
                where: {
                    email: email
                }
            });

            if (user) {
                return res.json({
                    success: false,
                    message: 'Korisnik sa tom e-mail adresom već postoji!'
                });
            }

            await User.create({
                forename: req.body.forename,
                surname: req.body.surname,
                email: email,
                passwordHash: await bcrypt.hash(req.body.password, 10),
                bornAt: req.body.bornAt,
                gender: req.body.gender,
                address: req.body.address,
                postalCode: req.body.postalCode,
                cityId: req.body.cityId
            });

            res.status(201).json({
                success: true,
                message: 'Registracija uspеšna'
            });

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async login(req, res) {
        let response = {
            success: false,
            message: 'Ne postoji korisnik sa zadatom e-mail adresom!'
        };

        const { email, password } = req.body;

        try {
            const foundUser = await User.findOne({
                where: {
                    email: email
                }
            });
            
            if (!foundUser) {
                return res.status(404).json(response);
            }

            let arePasswordsEqual = await bcrypt.compare(password, foundUser.dataValues.passwordHash);
            
            if (!arePasswordsEqual) {
                response.message = 'Uneli ste netačne pristupne podatke. Molimo Vas da pokušate ponovo.'
                return res.status(401).json(response);
            }
            
            response.success = true;
            response.message = 'Uspeštno ste se prijavili na sistem!'
            response.userId = foundUser.dataValues.userId;
            response.email = foundUser.dataValues.email;
            response.userRole = foundUser.role;

            // Ovde pravimo JWT token
            const webToken = jwt.sign({
                email: foundUser.email,
                userId: foundUser.userId,
                userRole: foundUser.role
            }, authConfig.authSecret, {
                expiresIn: "2h"
            });

            response.token = webToken;

            res.status(200).json(response);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
}

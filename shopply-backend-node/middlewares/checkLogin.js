const jwt = require('jsonwebtoken');
const authConfig = require('../configuration/authConfig');

module.exports = (req, res, next) => {
    try {
        const webToken = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(webToken, authConfig.authSecret);
        req.userData = decodedToken;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Neuspešna autorizacija'
        })
    }
}

const jwt = require('jsonwebtoken');
const authConfig = require('../configuration/authConfig');

module.exports = (req, res, next) => {
    try {
        console.log('EVO NAS');
        console.log(req.headers.authorization);
        const webToken = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(webToken, authConfig.authSecret);

        console.log(decodedToken.userRole !== 'admin');

        if (decodedToken.userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Nije Vam dozvoljen pristup ovom resursu!'
            });
        }

        req.userData = decodedToken;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Neuspešna autorizacija'
        })
    }
}

const jwt = require('jsonwebtoken'); 
const JWT_SECRET_SIGN = '0sjs6gf9m84hDI8EJ22pzn5hvpxmpgtty34tfx8gz17sy6djnm0xuc65bi9rcc';

module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
            userId: userData._id,
            userNom: userData.nom,
            userPrenom: userData.prenom
        },
        JWT_SECRET_SIGN,
        {
            expiresIn: '1h'
        })
    },
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getId: function(authorization) {
        var userId = -1;
        var token = module.exports.parseAuthorization(authorization);
        if (token != null) {
            try {
                var jwtToken = jwt.verify(token, JWT_SECRET_SIGN);
                if (jwtToken != null) {
                    userId = jwtToken.userId;
                }
            }
            catch(err) {}
        }
        return userId;
    }
};
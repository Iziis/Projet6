const jwt = require('jsonwebtoken'); // importer le package jsonwebtoken

module.exports = (req, res, next) => {

    try {

        // extraire le token du header authorization

        const token = req.headers.authorization.split(' ')[1];

        // décoder le token

        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

        // extraire l'utilisateur (userId) du token

        const userId = decodedToken.userId;

        // si l'utilisateur est différent de l'utilisateur extrait par le token

        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } 

        // si l'utilisateur est authentifié

        else {
            next();
        }

    } catch {

        // si une erreur se produit au moment d'extraire le token du header authorization

        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};

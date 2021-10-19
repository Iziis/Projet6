const bcrypt = require('bcrypt'); // importer le package bcrypt
const User = require('../models/user'); // importer le modèle user
const jwt = require('jsonwebtoken'); // importer le package jsonwebtoken

// fonction permettant aux utilisateurs de s'inscrire de façon sécurisée

exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password, 10) // «saler» le mot de passe 10 fois pour un hachage sécurisé

        .then(hash => {

            // créer un identifiant et un mot de passe 

            const user = new User({ 
                email: req.body.email,
                password: hash
            });

            // sauvegarder l'identifiant et le mot de passe dans la base de données

             user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })

        .catch(error => res.status(500).json({ error }));
};

// fonction permettant aux utilisateurs de se connecter de façon sécurisée

exports.login = (req, res, next) => {

    // vérifier que l'email entré correspond à un utilisateur existant

    User.findOne({ email: req.body.email }) 

        .then(user => {

            // si l'email entré ne correspond pas à un utilisateur existant

            if (!user) { 
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }

            // comparer le mot de passe entré avec le hash enregistré dans la base de données

            bcrypt.compare(req.body.password, user.password)

                .then(valid => {

                    // si le mot de passe entré est différent du hash enregistré dans la base de données

                    if (!valid) { 
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }

                    // si le mot de passe entré correspond au hash enregistré dans la base de données

                    res.status(200).json({
                        
                        userId: user._id,

                        // encoder un token d'une validité de 24h, qui contient l'userId

                        token: jwt.sign(

                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })

                .catch(error => res.status(500).json({ error }));
        })

        .catch(error => res.status(500).json({ error })); 
};
   
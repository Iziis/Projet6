const Sauce = require('../models/sauce'); // importer le modèle mongoose

const fs = require('fs'); // importer le package fs de node 

// ajouter une nouvelle sauce 

exports.createSauce = (req, res, next) => {

    // analyser le corps de la requête form-data pour obtenir un objet utilisable

    const sauceObject = JSON.parse(req.body.sauce); // !!!!!! undefined !!!!!   
    delete sauceObject._id;

    // créer une nouvelle sauce 

    const sauce = new Sauce({

        ...sauceObject,

        // récupérer l'url complète de l'image

        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

        // initialiser les likes et les dislikes de la sauce à 0

        likes: 0,
        dislikes: 0,

        // initialiser les usersLiked et usersDisliked avec des tableaux vides

        usersLiked: [],
        usersDisliked: []

    });

    // sauvegarder la sauce dans la base de données

    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }));
};
 
// récupérer la liste de toutes les sauces

exports.getAllStuff = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// récupérer une sauce en particulier

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// mettre à jour une sauce existante

exports.modifySauce = (req, res, next) => {

    // on créé un objet sauceObject et on regarde si req.file existe ou non
  
    let sauceObject = {};
    
    req.file ? 
  
     // si oui (l'utilisateur a mis à jour l'image), on supprime l'ancienne image, et on traite la nouvelle
  
        (

            Sauce.findOne({_id: req.params.id}) // récupérer la sauce à modifier

                .then((sauce) => {
     
                    // puisque l'URL de l'image contient un segment /images/, on peut séparer le nom de fichier de l'image avec split()
  
                    const filename = sauce.imageUrl.split('/images/')[1];
  
                    // supprimer l'ancienne image

                    fs.unlinkSync(`images/${filename}`)
                
                }),

                    // modifier la sauce et ajouter la nouvelle image

                    sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }

        ) : ( // () : () équivaut à une structure if/else
      
          // si non (l'utilisateur n'a pas mis à jour l'image), on traite juste l'objet entrant
          
          sauceObject = { ...req.body } 
        )
  
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }))
};

// supprimer une sauce existante

exports.deleteSauce = (req, res, next) => {

    // utiliser l'id reçu comme paramètre pour accéder à la sauce correspondante dans la base de données 
  
    Sauce.findOne({ _id: req.params.id })
  
        .then(sauce => {
  
            // puisque l'URL de l'image contient un segment /images/, on peut séparer le nom de fichier de l'image avec split()
  
            const filename = sauce.imageUrl.split('/images/')[1];
  
            // supprimer une sauce et le fichier image qui lui est associé
  
            fs.unlink(`images/${filename}`, () => {

                Sauce.deleteOne({ _id: req.params.id })

                    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })

      .catch(error => res.status(500).json({ error }));
};

// liker ou disliker une sauce 

exports.likeDislike = (req, res, next) => {
    
    let like = req.body.like; // on récupère le like
    let userId = req.body.userId; // on récupère l'userId
    let sauceId = req.params.id; // on récupère l'id de la sauce
    
    // si l'utilisateur like une sauce 

    if (like === 1) { 

        // on met à jour la sauce

        Sauce.updateOne({_id: sauceId},

            {
                // On push l'utilisateur à l'origine du like dans le tableau usersLiked

                $push: {
                    usersLiked: userId
                },

                // On incrémente de 1 le compteur de like
                
                $inc: {
                    likes: +1
                }, 
            }
        )

      .then(() => res.status(200).json({ message: 'Like enregistré !'}))
      .catch(error => res.status(400).json({ error }));

    }

    // si l'utilisateur dislike une sauce

    if (like === -1) { 

        // on met à jour la sauce

        Sauce.updateOne({_id: sauceId},

            {
                // On push l'utilisateur à l'origine du dislike dans le tableau usersDisliked

                $push: {
                    usersDisliked: userId
                },

                // On incrémente de 1 le compteur de dislike
                
                $inc: {
                    dislikes: +1
                }, 
            }
        )

      .then(() => res.status(200).json({ message: 'Dislike enregistré !'}))
      .catch(error => res.status(400).json({ error }));

    }

    // si l'utilisateur veut annuler un like ou un dislike sur une sauce

    if (like === 0) {
        
        Sauce.findOne({_id: sauceId})

            .then((sauce) => {

                // Si il s'agit d'annuler un like

                if (sauce.usersLiked.includes(userId)) { 

                    Sauce.updateOne({_id: sauceId},
                    
                        {
                            // On pull l'utilisateur à l'origine du like

                            $pull: {
                                usersLiked: userId
                            },

                            // On incrémente le compteur de like avec -1

                            $inc: {
                                likes: -1
                            }, 
                        })

                            .then(() => res.status(200).json({ message: 'Like retiré !'}))
                            .catch((error) => res.status(400).json({ error }))
                }

                // Si il s'agit d'annuler un dislike

                if (sauce.usersDisliked.includes(userId)) {

                    Sauce.updateOne({_id: sauceId}, 
                
                        {

                            // On pull l'utilisateur à l'origine du dislike

                            $pull: {
                                usersDisliked: userId
                            },

                            // On incrémente le compteur de dislike avec -1

                            $inc: {
                                dislikes: -1
                            }, 
                        })

                    .then(() => res.status(200).json({ message: 'Dislike retiré !'}))
                    .catch((error) => res.status(400).json({ error }))
                }
            })
            
            .catch((error) => res.status(404).json({ error }))
    }

};

// faire attention à ne pas envoyer le contenu du dossier images sur github
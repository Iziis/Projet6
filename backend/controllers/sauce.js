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
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
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
  
    const sauceObject = req.file ? // on créé un objet thingObject et on regarde si req.file existe ou non
  
     // si req.file existe (l'utilisateur a mis à jour l'image), on traite la nouvelle image
  
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } 
  
      // si req.file n'existe pas (l'utilisateur n'a pas mis à jour l'image) on traite juste l'objet entrant
      
      : { ...req.body }; 
  
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

// supprimer une sauce existante

exports.deleteSauce = (req, res, next) => {

    // utiliser l'id reçu comme paramètre pour accéder au thing correspondant dans la base de données 
  
    Sauce.findOne({ _id: req.params.id })
  
      .then(sauce => {
  
        // puisque l'URL de l'image contient un segment /images/, on peut séparer le nom de fichier de l'image avec split()
  
        const filename = sauce.imageUrl.split('/images/')[1];
  
        // supprimer le thing et le fichier image qui lui correspond
  
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

  /*

  // liker ou disliker une sauce 

  // !!!!! décommenter route likeDislike dans routeur !!!!

  exports.likeDislike = (req, res, next) => {
    
    let like = req.body.like; // on récupère le like
    let userId = req.body.userId; // on récupère l'userId
    let sauceId = req.params.id; // on récupère l'id de la sauce
    
    // si l'utilisateur like une sauce 

    if (like === 1) { 

        Sauce.updateOne({_id: sauceId})

    }

    // si l'utilisateur dislike une sauce 

    if (like === -1) { 

        Sauce.updateOne({_id: sauceId})

    }

    // si l'utilisateur veut annuler un like ou un dislike sur une sauce

    if (like === 0) { 

        Sauce.updateOne({_id: sauceId})

    }

  };

  */
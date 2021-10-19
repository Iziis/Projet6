const Sauce = require('../models/sauce'); // importer le modèle mongoose

// ajouter une nouvelle sauce 


// initialiser les likes et dislikes de la sauce à 0 et les usersLiked et usersDisliked avec des tableaux vides 

exports.createSauce = (req, res, next) => {

    // analyser le corps de la requête form-data pour obtenir un objet utilisable

    const sauceObject = JSON.parse(req.body.sauce); // !!!!!! undefined !!!!!   
    delete sauceObject._id;

    // créer une nouvelle sauce 

    const sauce = new Sauce({

        ...sauceObject,

        // récupérer l'url complète de l'image

        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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
  
    const sauce = new Sauce({
    
        userId : req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper : req.body.mainPepper,
        imageUrl : req.body.imageUrl,
        heat : req.body.heat

    });

  Sauce.updateOne({_id: req.params.id}, sauce)
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

// supprimer une sauce existante

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
};
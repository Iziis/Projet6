const mongoose = require('mongoose'); // importer le package mongoose

// créer un schéma sauce

const sauceSchema = mongoose.Schema({

    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },

});

module.exports = mongoose.model('Sauce', sauceSchema); // exporter le schéma sauce en tant que modèle mongoose
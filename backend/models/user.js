const mongoose = require('mongoose'); // importer le package mongoose
const uniqueValidator = require('mongoose-unique-validator'); // importer le package mongoose-unique-validator

// créer un modèle de données utilisateurs

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // s'assurer que 2 utilisateurs ne puissent pas partager la même adresse e-mail

module.exports = mongoose.model('User', userSchema);
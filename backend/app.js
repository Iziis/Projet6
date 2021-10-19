const express = require('express'); // importer express
const bodyParser = require('body-parser'); // importer le package bodyParser
const mongoose = require('mongoose'); // importer le package mongoose

const sauceRoutes = require('./routes/sauce'); // importer le routeur sauce

const userRoutes = require('./routes/user'); // importer le routeur user (données utilisateurs)

// lier l'application à MongoDB

mongoose.connect('mongodb+srv://Lefebvre_Iscia:Openclassrooms@projet6.sne7a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  
    { useNewUrlParser: true,
      useUnifiedTopology: true })

  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// ajouter les headers 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // permet d'accéder à l'API depuis n'importe quelle origine 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // permet d'ajouter les headers mentionnés ici aux requêtes envoyées par l'API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // permet d'envoyer des requêtes avec les méthodes mentionnées ici
    next();
});

app.use(bodyParser.json());

// enregistrer le routeur pour toutes les demandes effectuées vers /api/sauces

app.use('/api/sauces', sauceRoutes);

// enregistrer le routeur pour toutes les demandes effectuées vers /api/auth

app.use('/api/auth', userRoutes);

module.exports = app;

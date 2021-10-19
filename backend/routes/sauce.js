// créer le routeur sauce qui sera importé dans l'application (app.js)

const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth'); // importer le middleware destiné à protéger les routes sauce
const multer = require('../middleware/multer-config'); // importer le middleware destiné à pouvoir gérer les fichiers image entrants

const sauceCtrl = require('../controllers/sauce'); // importer le contrôleur sauce

router.get('/', auth, sauceCtrl.getAllStuff); // récupérer la liste de toutes les sauces
router.post('/', auth, multer, sauceCtrl.createSauce); // créer une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce); // récupérer une sauce en particulier
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // modifier une sauce existante
router.delete('/:id', auth, sauceCtrl.deleteSauce); // supprimer une sauce existante
router.post('/:id/like', auth, sauceCtrl.likeDislike) // pouvoir like ou dislike une sauce existante

module.exports = router; // exporter le routeur
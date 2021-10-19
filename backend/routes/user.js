// créer le routeur user (utilisateur) qui sera importé dans l'application (app.js)

const express = require('express');
const router = express.Router();

// importer le contrôleur user

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router; // exporter le routeur
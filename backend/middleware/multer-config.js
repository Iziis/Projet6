const multer = require('multer'); // importer le package multer 

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// indiquer à multer d'enregistrer les fichiers entrants dans le dossier images

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },

    filename: (req, file, callback) => {

        // indiquer à multer d'utiliser le nom d'origine du fichier, et de remplacer les espaces par des underscores

        const name = file.originalname.split(' ').join('_');

        // résoudre l'extension de fichier appropriée 

        const extension = MIME_TYPES[file.mimetype];

        callback(null, name + Date.now() + '.' + extension);
    }
});

// exporter l'élément multer configuré en lui indiquant de gérer uniquement les téléchargements de fichiers image

module.exports = multer({storage: storage}).single('image'); 

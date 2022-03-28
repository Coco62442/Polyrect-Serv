const mongoose = require('mongoose');

const eleve = mongoose.Schema({
    prenom: {
        type: String,
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mdp: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('eleve',eleve);
const mongoose = require('mongoose');

const prof = mongoose.Schema({
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
        required: true,
		unique: true
    },
    mdp: {
        type: String,
        required: true
    },
    dateFinContrat: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('prof',prof);
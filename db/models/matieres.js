const mongoose = require('mongoose');

const mat = mongoose.Schema({
    nom: {
        type: String,
        required: true,
        unique: true
    },
    prof: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'prof', 
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('matiere',mat);
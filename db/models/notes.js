const mongoose = require('mongoose');

const note = mongoose.Schema({
    note: {
        type: Number,
        default: 0
    },
    matiere: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mat",
        required: true
    },
    eleve: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "eleve",
        required: true
    },
    num: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('note',note);
const mongoose = require('mongoose');

const absence = mongoose.Schema({
    justifie: {
        type: Boolean,
        default: false,
        required: true
    },
    justification: {
        type: String,
    },
    date: {
        type: String,
        required: true
    },
    eleve: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'eleve',
        required: true
    }
});

module.exports = mongoose.model('absence',absence);
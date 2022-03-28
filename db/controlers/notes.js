const Note = require('../models/notes');
const jwtUtils = require('../../jwt.utils');

exports.createNote = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const eleve = req.body.eleve;
    const matiere = req.body.matiere;
    const num = req.body.num;

    const note = (req.body.note ? req.body.note : 0);
    
    Note.findOne({eleve: eleve, matiere: matiere, num: num})
    .then((noteFound) => {
        if (!noteFound) {
            const nvNote = new Note({
                note: note,
                eleve: eleve,
                matiere: matiere,
                num: num
            });
            nvNote.save()
            .then ((note) => {
                return res.status(201).json({note})
            })
            .catch( (error) => { return res.status(400).json({error}) });
        }
        else {
            return res.status(400).json({ 'erreur': 'Cette note a déjà était enregistré'})
        }
    })
    .catch((error) => {
        return res.status(400).json({ error })
    });
};

exports.getAllNote = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    Note.find()
    .then((notes) => { return res.status(200).json ( {notes} )})
    .catch((error) => { return res.status(400).json ({error}) });
};

exports.getOneNote = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const id = req.params.id;
                      
    Note.findOne({_id: id})
    .then((note) => { return res.status(200).json( {note} )})
    .catch((error) => { return res.status(400).json( {error}) });
};

exports.getAllNotesEleveByMatiere = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const idEleve = req.params.idEleve;
    const idMat = req.params.idMat

    Note.find({eleve : idEleve, matiere: idMat})
    .then((notes) => { return res.status(200).json ( {notes} )})
    .catch((error) => { return res.status(400).json ( {error} )});
};

exports.putNote = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const id = req.params.id;
    
    Note.findOne({_id: id})
    .then((eleveFound) => {
        eleveFound.updateOne({
            note: (req.body.note ? req.body.note: eleveFound.note),
            matiere: (req.body.matiere ? req.body.matiere: eleveFound.matiere),
            eleve: (req.body.eleve ? req.body.eleve: eleveFound.eleve),
            num: (req.body.num ? req.body.num: eleveFound.num)
        })
        .then((note) => {
            return res.status(200).json({note});
        })
        .catch((error) => {
            return res.status(400).json ( {error} );
        });
    })
    .catch((error) => { return res.status(400).json( {error} )});
};

exports.delNote = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const id = req.params.id;

    Note.deleteOne({_id: id})
    .then ((note) => { return res.status(200).json( {note} )})
    .catch ((error) => { return res.status(400).json( {error} )});
}

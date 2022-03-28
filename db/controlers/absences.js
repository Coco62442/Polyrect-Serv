const Absence = require('../models/absences');
const jwtUtils = require('../../jwt.utils');


exports.createAbsence = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const absence = new Absence(req.body);

    absence.save()
   .then((absence) => {
        return res.status(201).json({absence})
    })
   .catch( (error) => { return res.status(400).json({error}) });
};

exports.getAllAbsences = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    Absence.find()
    .then((absences) => { return res.status(200).json ( {absences} )})
    .catch((error) => { return res.status(400).json ({error}) });
};

exports.getAbsencesEleve = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const id = req.params.idEleve;
    
    Absence.find({eleve: id})
    .then((absence) => { return res.status(200).json( {absence} )})
    .catch((error) => { return res.status(400).json( {error}) });
};

exports.putAbsence = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const id = req.params.id;
    
    Absence.findOne({_id: id})
    .then ((absenceFound) => { 
        absenceFound.updateOne({
            justifie: req.body.justifie,
            justification: (req.body.justification ? req.body.justification: absenceFound.justification),
            date: (req.body.date ? req.body.date: absenceFound.date),
            eleve: (req.body.eleve ? req.body.eleve: absenceFound.eleve),
        })
        .then((absence) => {
            return res.status(200).json( {absence} );
        })
        .catch((error) => {
            return res.status(400).json ( {error} );
        });
    })
    .catch((error) => { return res.status(400).json( {error} )});
};

exports.delAbsence = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }
    
    const id = req.params.id;

    Absence.deleteOne({_id: id})
    .then((absence) => { return res.status(200).json( {absence} )})
    .catch((error) => { return res.status(400).json( {error} )});
};
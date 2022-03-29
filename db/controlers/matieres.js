const Mat = require('../models/matieres');
const jwtUtils = require('../../jwt.utils');

exports.createMat = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const mat = new Mat(req.body);

    mat.save()
   .then((mat) => {
        return res.status(200).json({mat})
    })
   .catch( (error) => { return res.status(400).json({error}) });
}


exports.getOneMat = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const id = req.params.idProf;
                      
    Mat.findOne({prof: id}, {_id: 1})
    .then((mat) => { 
        return res.status(200).json( {mat} )})
    .catch((error) => { return res.status(400).json( {error}) });
};

exports.getAllMats = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    Mat.find()
    .then((mats) => { return res.status(200).json ( {mats} )})
    .catch((error) => { return res.status(400).json ({error}) });
};

exports.putMat = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const id = req.params.id;
    
    Mat.findOne({_id: id})
    .then ((matFound) => {
        matFound.updateOne({
            nom: (nom ? nom: mat.matFound.nom),
            prof: (prof ? prof: matFound.prof),
        })
        .then((mat) => {
            return res.status(200).json({mat});
        })
        .catch((error) => {
            return res.status(400).json ( {error} );
        });
    })
    .catch((error) => { return res.status(400).json( {error} )});
};

exports.delMat = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const id = req.params.id;

    Mat.deleteOne({_id: id})
    .then((mat) => { return res.status(200).json( {mat} )})
    .catch((error) => { return res.status(400).json( {error} )});
}

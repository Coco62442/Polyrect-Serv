const Eleve = require('../models/eleves');
const Note = require('../models/notes')
const bcrypt = require('bcrypt');
const jwtUtils = require('../../jwt.utils');
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const MDP_REGEX = /^([ a-zA-Z0-9@ *#]{3,15})$/;

exports.createEleve = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const email = req.body.email;
    const nom = req.body.nom;
    const mdp = req.body.mdp;
    const prenom = req.body.prenom;

    if (email == null || nom == null || mdp == null || prenom == null) {
        return res.status(400).json({ 'error': 'paramètre manquant' });
    };

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ 'erreur': 'email non valid' });
    };
    if (!MDP_REGEX.test(mdp)) {
        return res.status(400).json ({ 'erreur': 'mot de passe non valide Le mot de passe doit comporter au moins 3 caractères et pas plus de 15 caractères.'});
    };

    Eleve.findOne({email: email})
        .then((userFound) => {
            if (!userFound) {
                bcrypt.hash(mdp, 5, function( err, bcryptedPassword ){
                    const eleve = new Eleve({ 
                        prenom: prenom,
                        nom: nom,
                        email: email,
                        mdp: bcryptedPassword
                    });
                    eleve.save()
                    .then((eleve) => {
                        return res.status(201).json({eleve});
                    })
                    .catch((err) => {
                        return res.status(400).json({err});
                    });
                });
            }
            else {
                return res.status(409).json ({ 'erreur': 'l\'utilisateur existe déjà' });
            }
        })
        .catch((err) => {return res.status(500).json({ err });
    });
};

exports.loginEleve = (req, res) => {
    const email = req.body.email; 
    const mdp = req.body.mdp;

    if (email == null || mdp == null) {  
        return res.status (400).json({ 'erreur': 'paramètre manquant' });
    }

    Eleve.findOne({email: email})
    .then((userFound) => {
        if (userFound) {
            bcrypt.compare(mdp, userFound.mdp, function(errBycrypt, resBycrypt) {
                if(resBycrypt) {
                    return res.status (200).json({
                        '_id': userFound.id,
                        'token': jwtUtils.generateTokenForUser(userFound),
                    });
                } 
                else {
                    return res.status(403).json({ 'erreur': 'mot de passe invalide' });
                };
            });
        }
        else {
            return res.status(404).json({ 'erreur': 'utilisateur inexistant'});
        }
    })
    .catch((err) => { return res.status(500).json( {err} )});
};

exports.getOneEleve = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(400).json({ 'erreur': 'Bad token'});
    }
    
    const id = req.params.id;
    
    Eleve.findOne({_id: id},{prenom: 1, nom: 1})
    .then((eleve) => { return res.status(200).json( {eleve} )})
    .catch((error) => { return res.status(400).json( {error} )});
};

exports.getAllEleves = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    Eleve.find({}, {_id: 1, prenom: 1, nom: 1})
    .then((eleves) => { return res.status(200).json ( {eleves} )})
    .catch((error) => { return res.status(400).json ( {error} )});
};

exports.putEleve = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const id = req.params.id;

    const email = req.body.email;
    const nom = req.body.nom;
    const mdp = req.body.mdp;
    const prenom = req.body.prenom;

    if (email != null && !EMAIL_REGEX.test(email)) {
        return res.status(400).json({ 'erreur': 'email non valid' });
    };

    if (mdp != null && !MDP_REGEX.test(mdp)) {
        return res.status(400).json ({ 'erreur': 'mot de passe non valide Le mot de passe doit comporter au moins 3 caractères et pas plus de 15 caractères.'});
    };
    
    Eleve.findOne({_id: id})
    .then ((eleve) => {
        bcrypt.hash(mdp, 5, function( err, bcryptedPassword ){
            eleve.updateOne({
                email: (email ? email : eleve.email),
                prenom: (prenom ? prenom : eleve.prenom),
                nom: (nom ? nom : eleve.nom),
                mdp: (mdp ? bcryptedPassword : eleve.mdp)
            })            
            .then((eleve) => {
                return res.status(200).json({eleve});
            })
            .catch((error) => {
                return res.status(400).json ( {error} );
            });
        });
    })
    .catch((error) => { return res.status(400).json( {error} )});
};

exports.delEleve = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }
    
    const id = req.params.id;

	Note.deleteMany({eleve: id})
	.then((note) => {
		Eleve.deleteOne({_id: id})
		.then((eleve) => { return res.status(200).json( {eleve, note} )})
		.catch((error) => { return res.status(400).json( {error} )});
	})
	.catch((error) => { return res.status(400).json( {error} )})
};
const Prof = require('../models/profs');
const Mat = require('../models/matieres');
const bcrypt = require('bcrypt');
const jwtUtils = require('../../jwt.utils');
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const MDP_REGEX = /^([ a-zA-Z0-9@ *#]{3,15})$/;

exports.createProf = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const email = req.body.email;
    const nom = req.body.nom;
    const mdp = req.body.mdp;
    const prenom = req.body.prenom;
    const dateFinContrat = req.body.dateFinContrat;
	const nomMat = req.body.mat;

    if (email == null || nom == null || mdp == null || prenom == null || dateFinContrat == null || nomMat == null) {
        return res.status(400).json({ 'error': 'paramètre manquant' });
    }

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ 'erreur': 'email non valid' });
    };
    
    if (!MDP_REGEX.test(mdp)) {
        return res.status(400).json ({ 'erreur': 'mot de passe non valide Le mot de passe doit comporter au moins 3 caractères et pas plus de 15 caractères.'});
    };

    Prof.findOne({email: email})
    .then((profFound) => {
        if (!profFound) {
			Mat.findOne({nom: nomMat})
			.then((matFound) => {
				if (!matFound) {
					bcrypt.hash(mdp, 5, function( err, bcryptedPassword ){
						const prof = new Prof({ 
							prenom: prenom,
							nom: nom,
							email: email,
							mdp: bcryptedPassword,
							dateFinContrat: dateFinContrat
						});
						prof.save()
						.then((prof) => {
							const mat = new Mat({
								nom: nomMat,
								prof: prof._id
							});
							mat.save()
							.then((mat) => {
								return res.status(201).json({mat, prof})
							})
							.catch( (error) => { return res.status(400).json({error}) });
						})
						.catch((err) => {
							return res.status(400).json({err});
						});
					});
				}
				else {
					return res.status(409).json ({ 'erreur': 'la matière existe déjà'});
				}
			})
			.catch((err) => { return res.status(500)});
        }
        else {
            return res.status(409).json ({ 'erreur': 'l\'utilisateur existe déjà' });
        }
    })
    .catch((err) => {return res.status(500).json({ err })});
};

exports.loginProf = (req, res) => {
    const email = req.body.email; 
    const mdp = req.body.mdp;

    if (email == null || mdp == null) {  
        return res.status (400).json({ 'erreur': 'paramètre manquant' });
    }

    Prof.findOne({email: email})
    .then((userFound) => {
        if (userFound) {
            bcrypt.compare(mdp, userFound.mdp, function(errBycrypt, resBycrypt) {
                if(resBycrypt) {
                    return res.status (200).json({
                        '_id': userFound.id,
                        'token': jwtUtils.generateTokenForUser(userFound)
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
    .catch((err) => { return res.status(500).json( {'erreur': 'incapable de vérifier l\'utilisateur'} )});
};

exports.getOneProf = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const id = req.params.id;
                      
    Prof.findOne({_id: id})
    .then ((prof) => { return res.status(200).json( {
        prenom: prof.prenom,
        nom: prof.nom,
        email: prof.email
    } )})
    .catch((error) => { return res.status(400).json( {error}) });
};

exports.getAllProfs = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    Prof.find()
    .then((profs) => { return res.status(200).json ( {profs} )})
    .catch((error) => { return res.status(400).json ({error}) });
};

exports.putProf = (req, res) => {
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
    const dateFinContrat = req.body.dateFinContrat;

    if (email != null && !EMAIL_REGEX.test(email)) {
        return res.status(400).json({ 'erreur': 'email non valid' });
    };

    if (mdp != null && !MDP_REGEX.test(mdp)) {
        return res.status(400).json ({ 'erreur': 'mot de passe non valide Le mot de passe doit comporter au moins 3 caractères et pas plus de 15 caractères.'});
    };

    Prof.findOne({_id: id})
    .then ((prof) => {
        bcrypt.hash(mdp, 5, function( err, bcryptedPassword ){
            prof.updateOne({
                prenom: (prenom ? prenom: prof.prenom),
                nom: (nom ? nom: prof.nom),
                email: (email ? email: prof.email),
                mdp: (bcryptedPassword ? mdp: prof.mdp),
                dateFinContrat: (dateFinContrat ? dateFinContrat: prof.dateFinContrat)
            })
            .then((prof) => {
                return res.status(200).json({prof});
            })
            .catch((error) => {
                return res.status(400).json ( {error} );
            });
        });
    })
    .catch((error) => { return res.status(400).json( {error} )});
};

exports.delProf = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }
    
    const id = req.params.id;

    Prof.deleteOne({_id: id})
    .then((prof) => { return res.status(200).json( {prof} )})
    .catch ((error) => { return res.status(400).json( {error} )});
}

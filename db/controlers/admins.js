const Admin = require('../models/admins');
const bcrypt = require('bcrypt');
const jwtUtils = require('../../jwt.utils');
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const MDP_REGEX = /^([ a-zA-Z0-9@ *#]{3,15})$/;

exports.createAdmin = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }
    
    const idAdmin = req.params.id

    Admin.findOne({_id : idAdmin})
    .then((adminFound) => {
        if (adminFound) {
            const email = req.body.email;
            const nom = req.body.nom;
            const mdp = req.body.mdp;
            const prenom = req.body.prenom;

            if (email == null || nom == null || mdp == null || prenom == null) {
                return res.status(400).json({ 'error': 'paramètre manquant' });
            }

            if (!EMAIL_REGEX.test(email)) {
                return res.status(400).json({ 'erreur': 'email non valid' });
            };
            
            if (!MDP_REGEX.test(mdp)) {
                return res.status(400).json ({ 'erreur': 'mot de passe non valide Le mot de passe doit comporter au moins 3 caractères et pas plus de 15 caractères.'});
            };

            Admin.findOne({email: email})
            .then((userFound) => {
                if (!userFound) {
                    bcrypt.hash(mdp, 5, function( err, bcryptedPassword ){
                        const admin = new Admin({ 
                            prenom: prenom,
                            nom: nom,
                            email: email,
                            mdp: bcryptedPassword,
                        });
                        admin.save()
                        .then((admin) => {
                            return res.status(201).json({admin});
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
            .catch((err) => {return res.status(500).json({ err })});
        }
        else {
            return res.status(400).json ({ 'erreur': 'Vous devez être admin pour créer un admin'});
        }
    })
    .catch((err) => {
        return res.status(400).json({ err });
    })

    
};

exports.loginAdmin = (req, res) => {
    const email = req.body.email; 
    const mdp = req.body.mdp;

    if (email == null || mdp == null) {  
        return res.status (400).json({ 'erreur': 'paramètre manquant' });
    }

    Admin.findOne({email: email})
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

exports.getOneAdmin = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    const id = req.params.id;
                      
    Admin.findOne({_id: id}, {email: 1, prenom: 1, nom: 1})
    .then ((admin) => { return res.status(200).json( {admin } )})
    .catch((error) => { return res.status(400).json( {error} )});
};

exports.getAllAdmins = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }

    Admin.find({},{mdp: 0})
    .then((admins) => { return res.status(200).json ( {admins} )})
    .catch((error) => { return res.status(400).json ( {error} )});
};

exports.putAdmin = (req, res) => {
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

    Admin.findOne({_id: id})
    .then ((admin) => {
        bcrypt.hash(mdp, 5, function( err, bcryptedPassword ){
            admin.updateOne({
                prenom: (prenom ? prenom: admin.prenom),
                nom: (nom ? nom: admin.nom),
                email: (email ? email: admin.email),
                mdp: (mdp ? bcryptedPassword: admin.mdp),
            })
            .then((admin) => {
                return res.status(200).json({admin});
            })
            .catch((error) => {
                return res.status(400).json ( {error} );
            });
        });
    })
    .catch((error) => { return res.status(400).json( {error} )});
};

exports.delAdmin = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getId(headerAuth);
    if (userId < 0) {
        return res.status(401).json({ 'error': 'Bad token'});
    }
    
    Admin.find()
    .then((admins) => {
        if (admins.length == 1) {
            return res.status(400).json({ 'error': 'Collection admin jamais vide!'});
        }
        else {
            const admin = req.params.admin;

            Admin.findOne({_id: admin})
            .then((adminFound) => {
                if (adminFound) {
                    const id = req.params.id;
                    Admin.deleteOne({_id: id})
                    .then((admin) => { return res.status(200).json( {admin} )})
                    .catch ((error) => { return res.status(400).json( {error} )});
                }
                else {
                    return res.status(400).json( {'error': 'Il faut être administrateur pour supprimer un administrateur'});
                }
            })
            .catch((error) => {
                return res.status(500).json({ error });
            })
        }
    })
    .catch((error) => {
        return res.status(400).json({ error });
    });  
}

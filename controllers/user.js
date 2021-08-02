/**
 * user controller
 * 
 * Contains business logic that is applied with the routes
 * 
 * Model and necessary plugin first imported with require('') before code
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @function signup
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
 * 
 * First hashes the req.body.password, then uses a ten rounds salt on it. Hash is stored with the mail on database
 */

exports.signup = (req, res, next) => {
        
     bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({ 
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(() => res.status(201).json({ message: ' Nouvel utilisateur créé !' }))
            .catch( error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
    
};

/**
 * @function login
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    * 
    * First searches in the database for user with same email adress than req.body.email
    * then if match, compare the crypted password with @bcrypt function compare to determine if the req.body.password has the same string origin
    * If ok, creates a Token, valid within 24 hours using @jsonwebtoken (userId, secret phrase or Key)
    * 
 */
exports.login = (req, res, next) => {

  User.findOne({ email: req.body.email })
    .then(user=> {
        if(!user) {
            return res.status(401).json({message: 'Utilisateur non trouvé '});
        }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid){
                    return res.status(401).json({message: 'Mot de passe incorrect '
        });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SO_SECRET_THAT_ITS_SECRET_IS_ALSO_A_SECRET',
                        { expiresIn: '24h' }
                    )
                });                
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


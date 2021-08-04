// @ts-nocheck
/**
 * user controller
 * 
 * Contains business logic that is applied with the routes
 * 
 * Models and necessary plugin first imported with require('') before code
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const User = require('../models/User');
const dotenv = require('dotenv').config();

/**
 * @function signup
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
 * 
 * First a key and iv are set, then the req.body.email is crypted using key and iv (those are later used to re-set the exact encryption to find user) via use of @CryptoJS .
 * Then req.body.password is hashed with a ten rounds salt added with @bcrypt .
 * The user is saved on database with the cryptedEmail and the hash.
 */

exports.signup = (req, res, next) => {

let key = process.env.KEY.toString(); 
let iv  = process.env.IV.toString(); 
            
key = CryptoJS.enc.Base64.parse(key); 
iv = CryptoJS.enc.Base64.parse(iv);
let cryptedEmail = CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();

     bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({ 
            email: cryptedEmail,
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
    * Req.body.email is encrypted the same way than in the signup function. Then, the cryptedEmail is used to find the user in the mongo database.
    * If password if correct (use of @bcrypt compare function), token is created by @jsonwebtoken for auth requests that will be needed on sauce routes.
 */
exports.login = (req, res, next) => {

let key = process.env.KEY.toString(); 
let iv  = process.env.IV.toString(); 
            
key = CryptoJS.enc.Base64.parse(key); 
iv = CryptoJS.enc.Base64.parse(iv);
let cryptedEmail = CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();
    
  User.findOne({ email: cryptedEmail } )
    .then(user => {
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


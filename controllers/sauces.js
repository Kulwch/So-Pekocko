// @ts-nocheck
/**
 * sauce controller
 * 
 * Contains business logic that is applied with the routes
 * 
 * Model and necessary plugin first imported with require('') before code
 */

const Sauce = require('../models/Sauce');
const fs = require('fs');

/**
 * @function createSauce
    * @param {*} req 
    * @param {*} res 
    * @param {*} next

* Creates a sauce JSON object from the input fields, and stores a jpg/png file in images folder
*/

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce créée !'}))
        .catch((error) => res.status(400).json({ error }))
};

/**
 * @function modifySauce
    * @param {*} req 
    * @param {*} res 
    * @param {*} next

* Modifies the JSON object from the input fields, and updates if necessary the jpg/png file in images folder
*/


exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

/**
 * @function deleteSauce
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
* 
*Deletes the selected sauce from database, erases the file from images folder 
 */

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

/**
 * @function getAllSauce
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
* 
*Retrieves the JSON objects list from the databse so that frontend will display it
 */

exports.getAllSauce = (req, res, next) => {
    Sauce.find().
        then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error })
)};

/**
 * @function getOneSauce
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
* 
* When user has clicked on one particular sauce, the getOneSauce function gathers all infos (see model) on that sauce so that frontend will display it
*/

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    })
    .then(
        (sauce) => res.status(200).json(sauce))
    .catch((error) => 
            res.status(404).json({ error }))        
};

/**
 * @function rateOneSauce
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
 * 
 * Function manages the ratings of each sauce: if a users likes one sauce, its userId is added to the usersLiked array, and the likes count is incremented by One.
 * Same for dislikes. The users can also reset its preference by clicking one more time on the like/dislike button.
 * 
 * A switch is used to determine which action to do regarding to the req.body.like value.
 * As for the likes and dislikes, the userId is compared with the usersLiked/usersDisliked array: if included, return stops the function to avoid voting twice.
 */

exports.rateOneSauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id }).then((sauce) => {

        switch (req.body.like) {
            case 0:                
                    if (sauce.usersLiked.includes( req.body.userId )) {  
                        Sauce.updateOne({ _id: req.params.id }, {         
                            $inc: { likes: -1 },                            
                            $pull: { usersLiked: req.body.userId }         
                        })
                        .then(() => { res.status(201).json({ message: 'vote annulé.'})}) 
                        .catch((error) => { res.status(400).json({error})});
                    } 
                    if (sauce.usersDisliked.includes( req.body.userId )) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.body.userId } 
                        })
                        .then(() => { res.status(201).json({ message: 'like/dislike annulé.'})})
                        .catch((error) => { res.status(400).json({error})});
                    }
                break;

            case 1:                
                    if(sauce.usersLiked.includes( req.body.userId )) {
                        return;
                    }
                    Sauce.updateOne({ _id: req.params.id}, {
                        $inc: { likes: +1 },
                        $push: { usersLiked: req.body.userId }
                    })
                    .then(() => { res.status(201).json({message: 'Sauce likée'})})               
                break;
            
            case -1:                
                    if(sauce.usersDisliked.includes( req.body.userId )) {
                        return;
                    }                
                    Sauce.updateOne({ _id: req.params.id}, {
                        $inc: { dislikes: +1 },
                        $push: { usersDisliked: req.body.userId }
                    })
                    .then(() => { res.status(201).json({message: 'Sauce dislikée !'})})               
                break;

            default:
                return 'Requête invalide';
        }
    })
    .catch((error) => res.status(404).json({error}));
}
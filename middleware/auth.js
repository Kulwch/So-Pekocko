// @ts-nocheck
/**
 * Auth - middleware:
 * Used to ensure authentication on api/sauce/ requests so that only registered users can access data
 * 
 * @jsonwebtoken is used to compare the bearer Token of the request with the userId. If match, user's request is allowed.
 * 
 */

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SO_SECRET_THAT_ITS_SECRET_IS_ALSO_A_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw Error;
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: new Error('Requête non valide !')
    });
  }
};

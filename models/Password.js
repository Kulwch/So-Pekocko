/**
 * Password Validator
 * 
 * installed via npm
 * 
    * sets up a password schema to comply users with a strong secure password:
    * Minimum length 8
    * Maximum length 100
    * Must have uppercase letters
    * Must have lowercase letters
    * Must have at least 2 digits
    * Should not have spaces
    * Can blacklist unsecure known passwords, like 'Passw0rd' or 'Password123'
 * 
 */

const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)                                   
.is().max(100)                                  
.has().uppercase()                             
.has().lowercase()                              
.has().digits(2)                                
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123', 'Motdepass3', 'Motdepasse123']); 

module.exports = passwordSchema;
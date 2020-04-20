const express = require('express');
const { check, body} = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);


router.post('/login',[
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
    body('password')
    .isLength({min: 6})
    .withMessage('Password must be at least 6 characters')
    .trim()
], authController.postLogin);


router.get('/signup', authController.getSignup);


router.post('/signup',[
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email')  // stored in msg of errors object 
    .custom((value, {req}) => {
        return User.findByEmail(value)
            .then(([user]) => {
                user = user[0];
                if (user) { 
                    return Promise.reject('Account with that email already exists, please use a different one');
            }
        });     
    })
    .normalizeEmail(),
    body('password', 'Password should be at least 6 characters with normal text characters and numbers only.')
    .isLength({min: 6})
    .isAlphanumeric()
    .trim(),
    body('confirmPassword')
    .trim()
    .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must match.');
        }
        return true;
    })
], authController.postSignup);


router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const  router = express.Router();

const isAuth = require('../middleware/is-auth');

const User = require('../models/user'); 

router.put('/signup',[
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value,{req})=>{
            return User.findOne({email: value}).then(userDoc => {
                if(userDoc){
                    return Promise.reject('Email address already exists');
                }
            })
        })
        .normalizeEmail(),
    body('password').trim().isLength({min: 5}),
    body('name').trim().not().isEmpty()
], authController.signup);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.put('/status', isAuth, authController.updateUserStatus);

module.exports = router;
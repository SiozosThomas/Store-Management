const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length > 1) {
            res.status(409).json({
                message: 'Mail exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    res.status(500).json({
                        message: err.message
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created',
                            user: user
                        });
                    }).catch(err => {
                        res.status(500).json({
                            message: err.message
                        });
                    });
                }
            });
        }  
    })
});

router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
        console.log(user);
        if (user == null) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed",
                    user: null
                });
            }
            if (result) {
                const token = jwt.sign({
                    email: user.email,
                    userId: user._id
                }, process.env.JWT_KEY, { expiresIn: "12h"});
                return res.status(200).json({
                    message: "Auth successful",
                    token: token
                });
            }
            return res.status(401).json({
                message: "Auth failed",
                user: null
            });
        });
    })
    .catch(err => {
        res.status(500).json({
            message: err.message
        })
    });
})

router.delete('/:userId', checkAuth, (req, res, next) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(() => {
        res.status(200).json({
            message: 'User deleted'
        });
    })
    .catch(err => {
        res.status(500).json({
            message: err.message
        });
    });
})

module.exports = router;
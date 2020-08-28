const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../models/user');

exports.createUser = (req, res, next) => {
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
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
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
                }, process.env.JWT_KEY, { expiresIn: "8h"});
                return res.status(200).json({
                    message: "Auth successful",
                    token: token,
                    expiresIn: 28800
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
};

exports.deleteUser = (req, res, next) => {
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
};
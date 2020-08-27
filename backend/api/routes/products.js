const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, (req, res, next) => {
    Product.find()
    .exec()
    .then(menu => {
        res.status(201).json({
            message: "GET request at /api/menu",
            menu: menu
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: err.message,
            menu: null
        });
    });
});

router.post('/', checkAuth, (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save()
    .then(() => {
        res.status(200).json({
            message: "Handling POST requests to /api/menu and saving to products",
            product: product
        });
    })
    .catch(err => {
        res.status(500).json({
            message: err.message,
            product: null
        });
    })
});

router.delete('/:productId', checkAuth, (req, res, next) => {
    Product.deleteOne({ _id: ObjectId(req.params.productId)})
    .exec()
    .then(() => {
        res.status(200).json({
            message: "Product with id: " + req.params.productId + " deleted"
        });
    })
    .catch(err => {
        res.status(500).json({
            message: err.message
        });
    })
});

module.exports = router;
const mongoose = require('mongoose');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
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
};

exports.createProduct = (req, res, next) => {
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
};

exports.deleteProduct = (req, res, next) => {
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
};
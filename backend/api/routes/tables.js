const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
ObjectId = require('mongodb').ObjectID;

const Table = require('../models/table');
const Order = require('../models/order');
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, (req, res, next) => {
    Table.find()
        .exec()
        .then(tables => {
            res.status(200).json({
                message: "GET request at /api/tables",
                tables: tables
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', checkAuth, (req, res, next) => {
    const table = new Table({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        number: req.body.number,
        orders: []
    });
    Table.findOne({
        number: req.body.number
    })
    .exec()
    .then(resTable => {
        if (!resTable) {
            table.save()
            .then(result => {
                res.status(201).json({
                    message: "Handling POST requests to /tables",
                    createdTable: table
                });
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message,
                    createdTable: null
                })
            });
        } else {
            res.status(500).json({
                message: "Can't add table with same number",
                createdTable: null
            })
        }
    })
});

router.post('/addOrder', checkAuth, (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        table: req.body.table
    });
    Table.findOne({
        number: order.table
    })
    .exec()
    .then((result) => {
        if (result) {
            Table.updateOne(
                { number: order.table },
                { $push: { orders: order }}
            )
            .exec()
            .then(() => {
                res.status(201).json({
                    message: "Handling POST requests to /orders and saving to tables",
                    createdOrder: order
                });
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message,
                    createdOrder: null
                });
            });
        } else {
            res.status(404).json({
                message: "Not table found with number " + order.table,
                createdOrder: null
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            message: err.message,
            createdOrder: null
        });
    });
});

router.delete('/:orderId/:tableId', checkAuth, (req, res, next) => {
    Table.update(
        { _id: ObjectId(req.params.tableId) },
        { $pull : {orders : {_id: ObjectId(req.params.orderId)}}}
    )
    .exec()
    .then(result => {
            console.log(result);
            res.status(201).json({
                result: result,
                message: "Product from table removed successfully"
            });
        })
    .catch(err => {
            res.status(500).json({
                message: err.message
            });
        });
});

router.delete('/:tableId', checkAuth, (req, res, next) => {
    Table.deleteOne({ _id: ObjectId(req.params.tableId)})
    .exec()
    .then(() => {
        res.status(200).json({
            message: "Table with id: " + req.params.tableId + " deleted"
        });
    })
    .catch(err => {
        res.status(500).json({
            message: err.message
        });
    })
});

module.exports = router;
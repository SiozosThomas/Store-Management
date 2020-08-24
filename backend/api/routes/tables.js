const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
ObjectId = require('mongodb').ObjectID;

const Table = require('../models/table');
const Order = require('../models/order');

router.get('/', (req, res, next) => {
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

router.post('/', (req, res, next) => {
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

router.delete('/:orderId', (req, res, next) => {
    Table.update(
        {  },
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
})

module.exports = router;
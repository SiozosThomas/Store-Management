const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Order = require('../models/order');
const Table = require('../models/table');

router.get('/', (req, res, next) => {
    res.status(201).json({
        message: "Handling GET requests to /orders"
    });
});

router.post('/', (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        table: req.body.table
    });
    order.save()
    .then(() => {
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
                        error: err
                    });
                });
            } else {
                res.status(404).json({
                    message: "Not table found with number " + order.table 
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:orderId', (req, res, next) => {
    res.status(201).json({
        message: 'Table details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    Order.deleteOne({_id: req.params.orderId})
    .exec()
    .then(() => {
        //console.log("Order removed successfully");
        res.status(201).json({
            message: "Order removed successfully"
        });
    })
    .catch(err => {
        res.status(500).json({
            message: err.message
        });
    });
})



module.exports = router;
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    table: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Order", orderSchema);
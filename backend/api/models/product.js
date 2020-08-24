const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: [true, "Name of product required"]
    },
    price: Number
});

module.exports = mongoose.model("Product", productSchema);
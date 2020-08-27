const mongoose = require('mongoose');

const tableSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    number: {
        type: Number,
        required: [true, 'Number required']
    },
    orders: {
        type: Array,
        ref: 'Order'
    },
    sum: Number
});

module.exports = mongoose.model("Table", tableSchema);
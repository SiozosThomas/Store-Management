const mongoose = require('mongoose');
const { unique } = require('jquery');

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
    }
});

module.exports = mongoose.model("Table", tableSchema);
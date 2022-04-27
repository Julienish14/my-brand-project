const mongoose = require("mongoose");


const messageSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String, 
    },
    message:{
        type: String, 
    },
    date: {
        type: Date, 
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);
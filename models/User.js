const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    full_name: {
        type: String,
    },
    email: {
        type: String, 
    },
    password:{
        type: String, 
        unique: true
    },
    date: {
        type: Date, 
        default: Date.now
    }, 
    isAdmin: Boolean
});

module.exports = mongoose.model('Users', UserSchema);

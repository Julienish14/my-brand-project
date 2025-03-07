const { string } = require("joi");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const commentSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    commentedBy: {
        type: String,
       
    },
    article: {
        type: ObjectId,
        ref: "Post" 
    },
    date: {
        type: Date, 
        default: Date.now
    }
});

module.exports = mongoose.model('Comments', commentSchema);
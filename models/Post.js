const { string, required } = require('joi');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const PostSchema = mongoose.Schema({
     title: {
         type: String, 
         required: true
     },
     content: {
         type: String, 
         required: true
     }, 
     blogImage: {
         type: String
     },
     likes:[
            {
            type: ObjectId,
            ref: "Users"
            }
        ],
    comments: [
        {
            type: ObjectId,
            ref: "Comments"
        }
    ],
     date: {
         type: Date, 
         default: Date.now
     },
});

PostSchema.virtual('Total.likes').get(function(){
    return " Total likes "+this.likes.length;
});

module.exports = mongoose.model('Posts', PostSchema);
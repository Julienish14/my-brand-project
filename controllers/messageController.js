const Message = require('../models/Message')


const messagePost = async(req, res) => {
    const message = new Message({
        name: req.body.name, 
        email: req.body.email,
        message: req.body.message
    })

    try{
           const savedMessage = await message.save();
           res.status(200).json({
               message: "Message saved successfully!",
               savedMessage
           });
        
    }catch(err){
        res.json({message: "Not saved!"});
    }
}

const messageGet = async (req, res) => {
    try{
        const getMessages = await Message.find();
        res.status(200).json({
            message: "All Messages",
            getMessages
        });
    }catch(err){
        res.json({ message: "Fail" });
    }
}

const getOneMessage = async (req, res) => {
    try{
        const getAmessage = await Message.findById(req.params.messageId);
        res.status(200).json({
            message: "Message",
            getAmessage
        });
    }catch(err){
        res.json({ message: err });
    }
}

const messageDelete = async (req, res) => {
    try{
        const deleteMessage = await Message.deleteOne({ _id: req.params.messageId });
        res.status(200).json({
            message: "Message deleted!",
            deleteMessage
        });
    }catch(err){
        res.json({ message: "Failed to delete"});
    }
}

module.exports ={
    messagePost,
    messageGet,
    getOneMessage,
    messageDelete
}
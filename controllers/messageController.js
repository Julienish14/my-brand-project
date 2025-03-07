const Message = require('../models/Message')


const messagePost = async(req, res) => {
    const message = new Message({
        name: req.body.name, 
        email: req.body.email,
        message: req.body.message
    })

    try{
           await message.save();
           res.status(201).json({
               message: "Message submitted successfully!",
               data:{
                   message
               }
           });
        
    }catch(err){
        res.status(500).json({
            status: "fail",
            message: "Not saved!"
        });
    }
}

const messageGet = async (req, res) => {
    try{
        const getMessages = await Message.find();
        res.status(200).json({
            message: "All Messages",
            getMessages
        });
        // console.log(getMessages)
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
        res.status(404).json({ 
            message: "Not found",
            err 
        });
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
        res.status(404).json({ 
            message: "Not found",
            err 
        });
        res.status(500).json({ 
            message: "Failed to delete",
            err
        });
    }
}

module.exports ={
    messagePost,
    messageGet,
    getOneMessage,
    messageDelete
}
const Post = require('../models/Post');
const commentModel = require('../models/Comment');

const commentOnArticle = async(req, res, next) =>{
    
    const comment = new commentModel({ 
        text: req.body.comment,
        commentedBy: req.user.full_name,
        article: req.params.postId
    });
    
    const saveComment = await comment.save();

    await Post.updateOne({_id: req.params.postId},
        {
            $push: {comments: saveComment._id}
        }
    )

    return res.status(200).send({
        message: "Your comment is saved successfully!",
        saveComment
    });
}


const deleteComment =async (req, res) => {
    try{
        const commentRemove = await commentModel.deleteOne({ _id: req.params.commentId });

        res.status(200).json({
            message: "comment deleted!",
            commentRemove
        });

    } catch (err) {
        res.status(404).json({ 
            message: 'comment Not found',
            err
        });
        res.status(500).json({ 
            message: 'No comment found',
            err 
        });
    }
}

const getAllComments = async (req, res) => {
    try{
        const allComm = await commentModel.find()
        
        res.status(200).json({
            message: "All comments",
            allComm
        });
    } catch (err) {
        res.status(500).json({ 
            message: 'No comment found',
            err 
        });
    }
}

const getOneComment = async (req, res) => {
    try{
        const singleComm = await commentModel.findById(req.params.commentId)
        res.status(200).json({
            message: "Comment",
            singleComm
        });
    } catch (err) {
        res.status(404).json({ 
            message: 'comment Not found',
            err
        });
    }
}

 module.exports = {
     commentOnArticle,
     getAllComments,
     getOneComment, 
     deleteComment
 }
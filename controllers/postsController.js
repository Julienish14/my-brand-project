const {path} = require('express/lib/application');
const Post = require('../models/Post');


const getAllPosts = async (req, res) => {

    try{
        const posts = await Post.find()
        .populate('comments', 'text commentedBy date')
        .populate('likes', 'full_name');
        res.status(200).json({
            message: "All blog post",
            posts
        });

    }catch(err){
        res.status(401).json({
             message: err 
        });
    }

}

const getOnePost = async (req, res) => {

    try{
        const oneArticle = await Post.findById(req.params.postId)
        .populate('comments', 'text commentedBy date')
        .populate('likes', 'full_name');
        res.status(200).json({
            message: "Post",
            oneArticle
        });
    }catch(err){
        res.json({ message: err });
    }
 }

const saveApost = async (req, res) => {
    console.log(req.file);
    const post = new Post({
        title: req.body.title, 
        content: req.body.content,
        blogImage: req.file ?  req.file.path: ''
    });
    try{
        const savedPost = await post.save();
        res.status(201).json({
            message: "New post added successfully!",
            savedPost
        });
    }catch(err){
            res.json({message: err});
    }
}



const deleteOnePost =async (req, res) => {
    try{
        const removedPost = await Post.deleteOne({ _id: req.params.postId });

        res.json({
            message: "Post deleted!", 
            removedPost
        });
    }catch(err){
        res.json({ message: err});
    }
}

const updatePost = async (req, res) => {
    try{
        const updatedPost = await Post.updateOne(
            { _id: req.params.postId }, 
            { $set: {title: req.body.title,
                content: req.body.content,
                blogImage: req.file ?  req.file.path: ''
            },
            
        });
        res.json({
            message:"Blog-post updated successfully!",
            updatedPost
        });
    }catch(err){
        res.json({ message: "Update fails",
            err
        });
    }
}

const like = async(req, res, next) => {
    const article = await Post.findById(req.params.postId);
    if(!article){
        return next("no article");
    }
    if(!article.likes.includes(req.user._id)){
        article.likes.push(req.user._id);
        article.save()
    }else{
        article.likes.pull(req.user._id);
        article.save();
    }
    res.status(200).json({
        status: 'success',
        data: {
            article
            
        }
    });
}


module.exports = {
    getAllPosts,
    saveApost,
    getOnePost,
    deleteOnePost,
    updatePost,
    like
}
const { path } = require("express/lib/application");
const Post = require("../models/Post");
const { uploadImage } = require("../utils/cloudinary");

// const saveApost = async (req, res) => {
//   const post = new Post({
//     title: req.body.title,
//     content: req.body.content,
//     // blogImage: req.file ? req.file.path : "",
//   });
//   try {
//     await post.save();
//     console.log(post);
//     return res.status(201).json({
//       message: "New article created successfully!",
//       data: {
//         post,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       message: "Failed to create an article",
//       err,
//     });
//   }
// };

const saveApost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blogImage = req.file ? await uploadImage(req.file) : null;

    const newBlog = await Post.create({ title, content, blogImage });

    res
      .status(201)
      .json({ message: "Blog created successfully!", data: newBlog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create a post" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("comments", "text commentedBy date")
      .populate("likes", "full_name");
    return res.status(200).json({
      message: "All created articles",
      posts,
    });
  } catch (err) {
    return res.status(500).json({
      message: "No article found",
      err,
    });
  }
};

const getOnePost = async (req, res) => {
  try {
    const oneArticle = await Post.findById(req.params.postId)
      .populate("comments", "text commentedBy date")
      .populate("likes", "full_name");
    return res.status(200).json({
      message: "Article",
      oneArticle,
    });
  } catch (err) {
    return res.status(404).json({
      message: "article Not found",
      err,
    });
  }
};

const deleteOnePost = async (req, res) => {
  try {
    const removedPost = await Post.deleteOne({ _id: req.params.postId });

    return res.status(200).json({
      message: "article deleted successfully!",
      removedPost,
    });
  } catch (err) {
    return res.status(404).json({
      message: "article Not found",
      err,
    });
    res.status(500).json({
      message: "Not deleted",
      err,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.updateOne(
      { _id: req.params.postId },
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          blogImage: req.file ? req.file.path : "",
        },
      }
    );
    return res.status(200).json({
      message: "Blog-post updated successfully!",
      updatedPost,
    });
  } catch (err) {
    return res.status(404).json({
      message: "article Not found",
      err,
    });
    res.status(500).json({
      message: "Update fails",
      err,
    });
  }
};

const like = async (req, res, next) => {
  const article = await Post.findById(req.params.postId);
  if (!article) {
    return next("no article");
  }
  if (!article.likes.includes(req.user._id)) {
    article.likes.push(req.user._id);
    article.save();
  } else {
    article.likes.pull(req.user._id);
    article.save();
  }
  res.status(200).json({
    status: "success",
    data: {
      article,
    },
  });
};

module.exports = {
  getAllPosts,
  saveApost,
  getOnePost,
  deleteOnePost,
  updatePost,
  like,
};

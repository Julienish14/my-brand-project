const Post = require("../models/Post");
const commentModel = require("../models/Comment");

// const commentOnArticle = async (req, res, next) => {
//   const commentData = req.body.text || req.body.comment;
//   const comment = new commentModel({
//     text: commentData,
//     commentedBy: req.user.full_name,
//     article: req.params.postId,
//   });

//   const saveComment = await comment.save();

//   await Post.updateOne(
//     { _id: req.params.postId },
//     {
//       $push: { comments: saveComment._id },
//     },
//   );
//   return res.status(200).send({
//     message: "Your comment is saved successfully!",
//     data: {
//       saveComment,
//     },
//   });
// };

const commentOnArticle = async (req, res, next) => {
  try {
    const commentData = req.body.text || req.body.comment; // Accepts either!

    if (!commentData) {
      return res
        .status(400)
        .json({ message: "Please provide a comment text." });
    }

    const comment = new commentModel({
      text: commentData,
      commentedBy: req.user.full_name,
      article: req.params.postId,
    });

    const saveComment = await comment.save();

    await Post.updateOne(
      { _id: req.params.postId },
      { $push: { comments: saveComment._id } },
    );

    return res.status(200).send({
      message: "Your comment is saved successfully!",
      data: { saveComment },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to save comment", error });
  }
};
const deleteComment = async (req, res) => {
  try {
    const commentRemove = await commentModel.deleteOne({
      _id: req.params.commentId,
    });

    return res.status(200).json({
      message: "comment deleted!",
      commentRemove,
    });
  } catch (err) {
    return res.status(404).json({
      message: "comment Not found",
      err,
    });
  }
};

const getAllComments = async (req, res) => {
  try {
    const allComm = await commentModel.find();

    // console.log(allComm);

    return res.status(200).json({
      message: "All comments",
      allComm,
    });
  } catch (err) {
    return res.status(500).json({
      message: "No comment found",
      err,
    });
  }
};

const getOneComment = async (req, res) => {
  try {
    const singleComm = await commentModel.findById(req.params.commentId);
    return res.status(200).json({
      message: "Comment",
      singleComm,
    });
  } catch (err) {
    return res.status(404).json({
      message: "comment Not found",
      err,
    });
  }
};

module.exports = {
  commentOnArticle,
  getAllComments,
  getOneComment,
  deleteComment,
};

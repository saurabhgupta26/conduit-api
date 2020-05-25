var express = require("express");
var router = express.Router();
var auth = require("../middlewares/auth");
var Article = require("../models/article");
var User = require("../models/user");
var Comment = require('../models/comment');
var slug = require("slug");

// CREATE COMMENT
router.post("/:slug/comments", auth.verifyToken, async function (req, res, next) {
    console.log(req.user.userId, "USERID");
    let validUser = await User.findById(req.user.userId);
    try {
      req.body.comment.author = validUser._id;
      
      var createComment = await Comment.create(req.body.comment);

      var article = await Article.findOneAndUpdate({
        slug: req.params.slug},
        { $push : {comment: createComment.id}
      });
      console.log(createComment, "Comment entered");

      var createComment = await Comment.findById(createComment.id)
      .populate("author", "username bio description image");
      // console.log(createComment, "NO USER");
      // console.log(author, "USER is here");
      // res.json({success : true, message : createComment });
      res.status(200).json({
        body: createComment.body,
        author: createComment.author.username,
      });
    } catch (error) {
      next(error);
    }
  });

// DELETE Comment

router.delete("/:slug/comments/:id", auth.verifyToken, async function (req, res, next) {
  try {
    // console.log(req.params.slug, "slug");
    var findArticle = await Article.findOneAndUpdate({ slug: req.params.slug }, {$pull: {comment : req.params.id}}, {new: true});
    
    var deleteComment = await Comment.findByIdAndDelete(req.params.id);
    res.json({success : true, findArticle});
  } catch (error) {
    next(error);
  }
});



module.exports = router;
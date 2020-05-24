var express = require("express");
var router = express.Router();
var auth = require("../middlewares/auth");
var Article = require("../models/article");
var User = require("../models/user");
var slug = require("slug");

// CREATE COMMENT
router.post("/:slug/comments", auth.verifyToken, async function (req, res, next) {
    console.log(req.body.article, req.user.userId);
    
    // try {
    //   req.body.article.author = req.user.userId;
    //   // req.body.tagList = req.body.tagList.split(',');
    //   req.body.article.slug = slug(req.body.article.title);
    //   var createArticle = await Article.create(req.body.article);
    //   console.log(createArticle, "CONSOLELOG");
    //   var createArticle = await Article.findById(createArticle.id).populate(
    //     "author"
    //   );
    //   // console.log(createArticle, "NO USER");
    //   // console.log(author, "USER is here");
    //   res.status(200).json({
    //     slug: createArticle.slug,
    //     title: createArticle.title,
    //     description: createArticle.description,
    //     body: createArticle.body,
    //     tagList: createArticle.tagList,
    //     author: createArticle.author.username,
    //   });
    // } catch (error) {
    //   next(error);
    // }
  });
  


module.exports = router;
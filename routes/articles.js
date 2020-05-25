var express = require("express");
var router = express.Router();
var auth = require("../middlewares/auth");
var Article = require("../models/article");
var User = require("../models/user");
var slug = require("slug");

// CREATE ARTICLE
router.post("/", auth.verifyToken, async function (req, res, next) {
  // console.log(req.body.article, req.user.userId);
  try {
    req.body.article.author = req.user.userId;
    // req.body.tagList = req.body.tagList.split(',');
    req.body.article.slug = slug(req.body.article.title);
    var createArticle = await Article.create(req.body.article);
    console.log(createArticle, "CONSOLELOG");
    var createArticle = await Article.findById(createArticle.id).populate(
      "author"
    );
    // console.log(createArticle, "NO USER");
    // console.log(author, "USER is here");
    res.status(200).json({
      slug: createArticle.slug,
      title: createArticle.title,
      description: createArticle.description,
      body: createArticle.body,
      tagList: createArticle.tagList,
      author: createArticle.author.username,
    });
  } catch (error) {
    next(error);
  }
});

// GET ARTICLE

router.get("/:slug/", async function (req, res, next) {
  try {
    var article = await Article.findOne({ slug: req.params.slug });
    console.log(article, "ARTICLE FROM GET");
    var article = await Article.findById(article.id).populate(
      "author",
      "username bio description image"
    );
    if (article) {
      res.status(200).json({
        article: {
          slug: article.slug,
          title: article.title,
          description: article.description,
          body: article.body,
          tagList: article.tagList,
          author: article.author,
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

// UPDATE ARTICLE

router.put("/:slug/", auth.verifyToken, async function (req, res, next) {
  try {
    // console.log(req.params.slug, "slug");
    var article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      req.body.article
    );
    var article = await Article.findById(article.id).populate(
      "author",
      "username bio description image"
    );
    console.log(article, "hello");
    res.status(200).json({
      article: {
        slug: req.params.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        author: article.author,
      },
    });
  } catch (error) {
    next(error);
  }
});

//DELETE ARTICLE

router.delete("/:slug/", auth.verifyToken, async function (req, res, next) {
  try {
    // console.log(req.params.slug, "slug");
    var article = await Article.findOneAndDelete({ slug: req.params.slug });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// FAVOURITE ARTICLE
router.post("/:slug/favorite/", auth.verifyToken, async function (
  req,
  res,
  next
) {
  try {
    var favourited = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      {
        $addToSet: { favourited: req.user.userId },
        $inc: { favouritesCount: 1 },
      },
      { new: true }
    );
    var favourited = await Article.findById(favourited.id).populate(
      "author",
      "username bio description image"
    );

    console.log(favourited, "Article");
    res.status(200).json({
      article: {
        slug: req.params.slug,
        title: favourited.title,
        description: favourited.description,
        body: favourited.body,
        tagList: favourited.tagList,
        favourited: true,
        favouritesCount: favourited.favouritesCount,
        author: favourited.author,
      },
    });
  } catch (error) {
    next(error);
  }
});

// UNFAVOURITE AN ARTICLE

router.delete("/:slug/favorite/", auth.verifyToken, async function (
  req,
  res,
  next
) {
  try {
    var favourited = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      { $pull: { favourited: req.user.userId }, $inc: { favouritesCount: -1 } },
      { new: true }
    );
    var favourited = await Article.findById(favourited.id).populate(
      "author",
      "username bio description image"
    );
    console.log(favourited, "Article");
    res.status(200).json({
      article: {
        slug: req.params.slug,
        title: favourited.title,
        description: favourited.description,
        body: favourited.body,
        tagList: favourited.tagList,
        favourited: true,
        favouritesCount: favourited.favouritesCount,
        author: favourited.author,
      },
    });
  } catch (error) {
    next(error);
  }
});

// FIND ARTICLES BY TAG

router.get("/", async function (req, res, next) {
  try {
    if (req.query.tagList) {
      let article = await Article.find({
        tagList: req.query.tagList,
      }).populate("author", "username bio description image");
      console.log(article, "coming or not");
      res.json({ success: true, article });
    } 

    else if (req.query.author) {
      let user = await User.find({username: req.query.author });
      console.log(user, "USER FOUND");

      if(user) {
      let article = await Article.find({
        username: user.id})
        .populate("author", "username bio description image");
      console.log(article, "coming or not");
      res.json({ success: true, article });
    } 
  } else if(req.query.favourited) {
      let user = await User.find({username : req.query.favourited });
      console.log(user, "FAV USER");
      if(user) {
        let article = await Article.find({
          username : user.id })
          .populate("author", "username bio description image");
          res.json({success : true, article});
      }
    } else {
      res.json({
        success: false,
        message: "author/tag not found",
      });
    }
 } catch (error) {
    next(error);
  }
});


module.exports = router;
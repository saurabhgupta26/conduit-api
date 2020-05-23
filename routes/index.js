var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Express' });
});

//GET USER
router.get('/api/user', auth.verifyToken, async (req, res, next) => {
  try {
    // console.log(req.userId);
    var user = await User.findById(req.user.userId);

    res.json({
      user : {
      email : user.email,
      username : user.username,
      token : req.user.token,
      bio : user.bio,
      image : user.image,
      following : user.following
      }
    });
    
  } catch (error) {
    next(error);
  }
  // console.log(req.headers);
  
});

// UPDATE USER

router.put('/api/user', auth.verifyToken, async function (req, res, next) {
	try {
    console.log(req.body.user, "USERID");
    var userId = req.user.userId;
    var user = await User.findByIdAndUpdate(userId, req.body.user);
    console.log(user, 'hello');
      res.status(200).json({
        email: user.email,
        username: user.username,
        token: req.user.token,
        bio : user.bio,
        image: user.image,
        following : user.following
      })
    } catch (error) {
      next(error);
    }
  });
  
  // GET USER PROFILE
  
  router.get('/api/profiles/:username', async (req, res, next) => {
    try {
      var user = await User.findOne({username : req.params.username});
      // console.log(user, "USER FROM GET")
      if(user) {
        // res.json({success : true, username : user.username});
        res.status(200).json({
          user : {
          username : user.username,        
          bio : user.bio,
          image : user.image,
          following : user.following
          }
        });
      } 
    } catch (error) {
        next(error);
    }
  });
  //check with the postman with the get request and with the profile username and get the data

// FOLLOW A USER

router.post('/api/profiles/:username/follow', auth.verifyToken, async function(req, res, next) {
  try {
    var followed = await User.findOneAndUpdate({username: req.params.username}, {$addToSet: {followers :req.user.userId}}, {new: true});
    var currentUser = await User.findByIdAndUpdate(req.user.userId, {$addToSet: {following :followed.id}}, {new: true});
    console.log(followed, "USER ID");
    console.log(currentUser, "2nd user");
    res.status(200).json({
      username : followed.username,
      bio : followed.bio,
      image : followed.image,
      following : true
    });
  } catch (error) {
      next(error);
  }
});

// UNFOLLOW A USER

router.delete('/api/profiles/:username/follow', auth.verifyToken, async function(req, res, next) {
  try {
    var followed = await User.findOneAndUpdate({username: req.params.username}, {$pull: {followers :req.user.userId}}, {new: true});
    var currentUser = await User.findByIdAndUpdate(req.user.userId, {$pull: {following :followed.id}}, {new: true});
    console.log(followed, "USER ID");
    console.log(currentUser, "2nd user");
    res.status(200).json({
      username : followed.username,
      bio : followed.bio,
      image : followed.image,
      following : false
    });
  } catch (error) {
      next(error);
  }
});

module.exports = router;

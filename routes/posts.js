var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: './public/uploads/' })

var mongo = require('mongodb')
var db = require('monk')('localhost/nodeblog')

/* GET posts */
router.get('/add', function(req, res, next) {
  var categories = db.get('categories')
  categories.find({}, {}, function(err, categories){
    res.render('posts/add', {title: "Add Post", categories: categories})
  })
});

router.get('/show/:id', function(req, res, next) {
  var post = db.get('posts')
  post.findById(req.params.id, function(err, post){
    res.render('posts/show', {
      'post': post
    })
  })
});

router.post('/add', upload.single('image'), function(req, res, next) {
  var title    = req.body.title
  var category = req.body.category
  var body     = req.body.body
  var author   = req.body.author
  var date     = new Date()
  
  if(req.file){
    var image = req.file.filename
  }else{
    var image = 'noimage.png'
  }

  // Form field validation
  req.checkBody('title', 'Enter a title.').notEmpty()

  var errors = req.validationErrors()
  if(errors){
    res.render('posts/add', {
      "errors": errors
    })
  }else{
    var posts = db.get('posts')
    posts.insert({
      'title': title,
      'category': category,
      'body': body,
      'author': author,
      'date': date,
      'image': image
    }, function(err, post){
      if(err){
        res.send(err)
      }else{
        req.flash('success', 'Post added')
        res.location('/')
        res.redirect('/')
      }

    })
  }
});


router.post('/addcomment', function(res, req, next) {
  console.log(req.body)
  var name = req.body.comment_name
  // var email  = req.body.comment_email
  // var body   = req.body.comment_body
  // var postId = req.body.postId
  // var commentDate = new Date()
  
  // // Form field validation
  // req.checkBody('name', 'Enter a name.').notEmpty()
  // req.checkBody('email', 'Enter a email.').notEmpty()
  // req.checkBody('email', 'Enter a valid email.').isEmail()
  // req.checkBody('body', 'Enter a comment body.').notEmpty()

  // var errors = req.validationErrors()
  // if(errors){
  //   var posts = db.get('posts')
  //   posts.findById(postId, function(err, post) {
  //     res.render('posts/show', {
  //       "post": post,
  //       "errors": errors
  //     })
  //   })
  // }else{
  //   var comment = {
  //     "name": name,
  //     "email": email,
  //     "body": body,
  //     "commentDate": commentDate
  //   }

  //   posts.update(
  //     {"_id": postId},
  //     {
  //       $push:{"comments": comment}
  //     },
  //     function(err, doc) {
  //       if(err){
  //         throw err
  //       }else{
  //         req.flash('success', 'Comment Added')
  //         res.location('/posts/show'+postId)
  //         res.redirect('/posts/show'+postId)
  //       }
  //   })
  // }
})

module.exports = router;

var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var mongo = require('mongodb')
var db = require('monk')('localhost/nodeblog')

/* GET posts */
router.get('/add', function(req, res, next) {
  var categories = db.get('categories')
  categories.find({}, {}, function(err, categories){
    res.render('posts/add', {title: "Add Post", categories: categories})
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

module.exports = router;

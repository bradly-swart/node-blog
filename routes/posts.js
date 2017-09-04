var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var mongo = require('mongodb')
var db = require('monk')('localhost/nodeblog')

/* GET posts */
router.get('/add', function(req, res, next) {
  res.render('posts/add', {title: "Add Post"})
});

router.post('/add', upload.single('image'), function(req, res, next) {
  var title = req.body.title
  var category = req.body.category
  var body = req.body.body
  var author = req.body.author
  var date = new Date()
  
  if(req.file){
    var image = req.file.filename
  }else{
    var image = 'noimage.png'
  }

  // Form field validation
  req.checkBody('title', 'Enter a title.').isEmpty()

  var errors = req.validationErrors()
  if(erros){
    res.render('posts/add', {
      "errors": errors
    })
  }else{
    var posts = db.get('posts')
    post.insert({
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
  res.render('posts/add', {title: "Add Post"})
});

module.exports = router;

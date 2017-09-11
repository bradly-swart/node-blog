var express = require('express');
var router = express.Router();

var mongo = require('mongodb')
var db = require('monk')('localhost/nodeblog')

/* GET posts */
router.get('/add', function(req, res, next) {
  res.render('categories/add', {title: "Add Category"})
});

router.post('/add', function(req, res, next) {
  var name = req.body.name
  // Form field validation
  req.checkBody('name', 'Enter a category name.').notEmpty()

  var errors = req.validationErrors()
  if(errors){
    res.render('categories/add', {
      "errors": errors
    })
  }else{
    var posts = db.get('categories')
    posts.insert({
      'name': name
    }, function(err, post){
      if(err){
        res.send(err)
      }else{
        req.flash('success', 'category added')
        res.location('/')
        res.redirect('/')
      }

    })
  }
});

module.exports = router;

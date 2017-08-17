var express = require('express');
var router = express.Router();
var knex = require('../db/knex.js');
var bcrypt = require('bcrypt')


/* GET index */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Profiles' });
});

//get create account page
router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Profiles' })
});

//create a new user
router.post('/create', function(req, res, next) {
  if (req.body.password === req.body.confirm) {
    bcrypt.hash(req.body.password, 8, function(err,hash) {
      knex.raw(`insert into users values (default, '${req.body.username}', '${hash}', '${req.body.email}')`)
      .then(function(data) {
        res.redirect('/')
      })
    })
  } else {
    res.redirect('create')
  }
});


//submitting credentials
router.post('/login', function(req,res,next) {
  knex.raw(`select * from users where username = '${req.body.username}'`)
  .then(function(users) {
    bcrypt.compare(req.body.password, users.rows[0].password, function(err, response) {
      if(response) {
        res.cookie('user_id', users.rows[0].id)
        res.redirect(`/userHome/${users.rows[0].id}`)
      } else {
      res.redirect('/')
      }
    })
  })
})


//route for correctly entered credentials
router.get('/userHome/:id', function(req,res,next) {
  if(req.cookies.user_id) {
    knex.raw(`select * from users where id = ${req.cookies.user_id}`)
    .then(function(user) {
      res.render('userHome', {user: user.rows[0]})
    })
  } else {
    res.redirect('/')
  }
})


//logout
router.get('/logout', function(req, res, next) {
  res.clearCookie('user_id');
  res.redirect('/');
});

//delete user
router.post('/userHome/:id/delete', function(req, res, next) {
  knex.raw(`delete from users where id = ${req.params.id}`)
  .then(function(data) {
    res.clearCookie('user_id');
    res.redirect('/')
  })
})

module.exports = router;

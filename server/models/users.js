var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../../DB/database.js')
var util = require('util')

var Users = module.exports;

Users.check = function(req, res){
  var email = req.body.query.email
  var name = req.body.query.name
  var github = req.body.query.github
  //return db.raw('SELECT user_id FROM users WHERE email = $1', [email])
  return db('users').select('*').where({email: email})
  .then(function (result){
    if(result.length === 0){
      //See if user exists
      return db('users').insert({name: name, email: email, github: github})
        .then(function(response){
          return db('users').select('*').where({name: name})
        })
        .then(function(user){
          // User is created, interview accepted
          res.status(200).send(user[0])
        })
        .catch(function (err) {
          res.status(404).send({messsgae: err})
        })
    } else {
      //Note: This case won't return a promise (may matter for future testing)
      var today = new Date;
      if(result[0].blackout !== null || result[0].blackout > today){
        //User exists, see if they have a blackout period
        res.status(404).send({message: "Please do not schedule an interview until after your reccomended time between interviews. Your earliest date would be " + result[0].blackout + ". If you have any questions please contact admissions at admissions@makersquare.com"})
       } else {
         //User has no blackout or is past the period, accept interview
         res.status(200).send(result[0])
       }
     }
  })
}

Users.setBlackout = function(req, res){
  var userEmail = req.body.email;
  var today = new Date();
  var month = today.getMonth();
  var year  = today.getFullYear();
  var day = today.getDate();
  var monthChange = month + req.body.blackout;

  var newBlackout = (year + "-" + monthChange + "-" + day).toString();

  // Function will return a promise that will resolve to undefined
  return db('users')
    .where('email', '=', userEmail)
    .update({
      blackout: newBlackout
    })
    .then(function(response){
      return db('users').select("*").where({email: userEmail})
        .then(function(user){
          res.status(201).send(user[0]);
        })
        .catch(function(err){
          res.status(404).send(err)
        })
    })
    .catch(function(err){
      res.status(401).send(err);
    })
}


Users.getAll = function(req, res){
  // Function will return a promise that will resolve to undefined
  return db('users').select('*')
    .then(function(response){
      res.status(200).send(response);
    })
    .catch(function(err){
      res.status(404).send(err)
    })
}

Users.interviewsByUser = function(req, res){
  console.log("req body",req.body.email)
  //show all interviews by user
  db('users').select('user_id').where('email',req.body.email)
    .then(function(userID){
      var user = userID[0]
      return db('interviews').select("*")
    })
    .then(function(response){
      if(response.length > 0){
        res.status(200).send(response)
      } else {
        res.status(404).send({message: "No interviews by this user"})
      }
    })
    .catch(function(err){
      res.status(404).send(err)
    })
}

Users.getAllSoftRejects = function(req, res){
  var today = new Date();
  return db('users').select("*").where('blackout', '<=', today)
  .then(function(response){

  })
}


Users.deleteTable = function() {
  return Promise.resolve(db.raw('truncate table users cascade'))
}

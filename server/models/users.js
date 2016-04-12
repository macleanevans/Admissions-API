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
         .then(function(user){
             res.status(200).send(user[0])
           })
        // User is created, interview accepted
      })
      .catch(function (err) {
        res.status(404).send({messsgae: err})
      })
    } else {
      var today = new Date;
      if(result[0].blackout !== null || result[0].blackout > today){
        //User exists, see if they have a blackout period
        res.status(404).send({message: "Please do not schedule an interview until after your reccomended time between interviews. Your earliest date would be " + result[0].blackout + ". If you have any questions please contact admissions at admissions@makersquare.com"})
       } else {
         //User has no blackout is or past the period, accept interview
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
  }).catch(function(err){
      res.status(401).send(err);
  })
}


Users.getAll = function(req, res){
  console.log("inside of getAll")
    return db('users').select('*')
      .then(function(response){
        console.log("response of select all", response)
        res.status(200).send(response);
      })
      .catch(function(err){
        res.status(404).send(err)
      })
}

Users.interviewsByUser= function(req, res){
  console.log("all interviews by user req",req)
  //show all interviews by user
    return db('users').select('email').where('user_id', '=', req.body.query)
    .then(function(response){
      console.log("response in users select")

    })
}

Users.getAllSoftRejects = function(req, res){
  var today = new Date();
  return db('users').select().where('blackout', '<=', today)
  .then(function(response){

  })
}


Users.deleteTable = function() {
  return db.raw('truncate table users cascade')
}

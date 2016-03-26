var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../../DB/database.js')
var util = require('util')

var Users = module.exports;

Users.check = function(req, res){
  console.log("request", req.body.query)
  var email = req.body.query.email
  var name = req.body.query.name
  var github = req.body.query.github
  //return db.raw('SELECT user_id FROM users WHERE email = $1', [email])
  return db('users').select('*').where({email: email})
  .then(function (result){
    console.log("result from users check", result);
    if(result.length === 0){
      console.log("did not find anyone")
      //See if user exists
      return db('users').insert({name: name, email: email, github: github})
       .then(function(response){
        // User is created, interview accepted
        console.log("second response", response)
        res.status(200).send(response)
      })
      .catch(function (err) {
        res.status(404).send({messsgae: err})
      })
    } else {
      console.log("He/She exists")
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
    console.log("newBlackout", newBlackout);
      return db('users')
        .where('email', '=', userEmail)
        .update({
          blackout: newBlackout
        })
        .then(function(response){
        res.status(201).send();
  }).catch(function(err){
      res.status(401).send(err);
  })
}


Users.getAll = function(req, res){
    return db.select('name').from('users').where('name', '!=', 'null')
      .then(function(response){
        res.status(200).send(response);
      })
      .catch(function(err){
        res.status(404).send(err)
      })
}


Users.deleteTable = function() {
  db.raw('TRUNCATE TABLE users');
   return Promise.resolve();
   //db('users').truncate();
}

var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../../DB/database.js')
var util = require('util')
var pg = require('pg')
var TestDB = require('../../DB/database.js')

var Users = module.exports;

Users.check = function(req, res){
  var email = req.query.email
  var name = req.query.name
  var github = req.query.github
  db.raw('SELECT user_id FROM users WHERE email = $1', [email]).then(function (result){
    console.log("result from users check", result);
    if(result.rows.length === 0){
      //See if user exists
      db.raw('INSERT INTO users (name, email, github, blackout) VALUES ($1, $2, $3, $4)', [name, email, github, NULL]).then(function(response){
        // User is created, interview accepted
        res.status(200).send()
      })
      .catch(function (err) {
        res.status(401).send({ messsgae: err })
      })
    } else {
      var today = new Date;
      if(result.rows[0].blackout !== NULL || result.rows[0].blackout > today){
        //User exists, see if they have a blackout period
        res.status(401).send({message: "Please do not schedule an interview until after your reccomended time between interviews. Your earliest date would be " + response.rows[0].blackout + ". If you have any questions please contact admissions at admissions@makersquare.com"})
       } else {
         //User has no blackout is or past the period, accept interview
         res.status(200).send()
       }
     }
  })
}

Users.setBlackout = function(req, res){
  pg.connect(TestDB.connectString, function(err, client, done){
    var userEmail = req.email;
    var userBlackout = req.blackout;
    client.query('INSERT INTO users WHERE email = $1 VALUES ($2)', [userEmail, userBlackout], function(err, response){
      if(err){
        done();
        res.status(401).send(err);
      } else {
        res.status(201).send(response);
      }
    })
  })
}

Users.getAll = function(req, res){
    db.raw('SELECT NAME FROM USERS').then(function(response){
      res.status(200).send(response)
      .catch(function(err){
        res.status(401).send({messgae: 'we broke this'});
      })
    })
}

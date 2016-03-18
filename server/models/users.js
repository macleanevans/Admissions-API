var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../lib/db.js')
var util = require('util')
var pg = require('pg')
var TestDB = require('../../DB/database.js')

var Users = module.exports;

Users.check = function(req, res){
  var email = req.query.email
  var name = req.query.name
  var github = req.query.github
  pg.connect(TestDB.connectString, function(err, client, done){
    if(err){
     console.error(err);
   }
     client.query('SELECT user_id FROM users WHERE email = $1', [email], function (err, result){
       console.log("result from users check", result);
       if(result.rows.length === 0){
         //See if user exists
         client.query('INSERT INTO users (name, email, github, blackout) VALUES ($1, $2, $3, $4)', [name, email, github, NULL], function(err, response){
          if(err){
            done();
            res.status(401).send({messsgae: err})
          } else {
            //User is created, interview accepted
            done();
            res.status(200).send()
          }
         })
       }else {
         var today = new Date;
         if(result.rows[0].blackout !== NULL || result.rows[0].blackout > today){
           //User exists, see if they have a blackout period
           done();
           res.status(401).send({message: "Please do not schedule an interview until after your reccomended time between interviews. Your earliest date would be " + response.rows[0].blackout + ". If you have any questions please contact admissions at admissions@makersquare.com"})
         } else {
           //User has no blackout is or past the period, accept interview
           done();
           res.status(200).send()
         }
       }
    })
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
  }
}

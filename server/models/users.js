var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../lib/db.js')
var util = require('util')
var pg = require('pg')
var TestDB = require('../../DB/database.js')

var Users = module.exports;

Users.check = function(req, res){
  pg.connect(TestDB.connectString, function(err, client, done){
    if(err){
     console.error(err);
   }
     client.query('SELECT user_id FROM users WHERE email = $1', [req.email], function (err, result){
       console.log("result from users check", result);
       if(result.rows.length === 0){
         //See if user exists
         client.query('INSERT INTO users (first_name, last_name, email, github, blackout) VALUES ($1, $2, $3, $4, $5)', [req.first_name, req.last_name, req.email, req.github, NULL], function(err, response){
          if(err){
            res.status(401).send({messsgae: err})
          } else {
            //Create an interview
            Interview.create(req, res)
          }
         })
       }else {
         var today = new Date;
         if(result.rows[0].blackout !== NULL || result.rows[0].blackout > today){
           //User exists, see if they have a blackout period
           res.status(401).send({message: "Please do not schedule an interview until after your reccomended time between interviews. Your earliest date would be " + response.rows[0].blackout + ". If you have any questions please contact admissions at admissions@makersquare.com"})
         } else {
           //Create interview
         }
       }
    })
  })
}

Users.create = function(req){

}

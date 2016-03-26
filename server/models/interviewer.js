var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../../DB/database.js')
var util = require('util')

var Interviewer = module.exports;


Interviewer.create = function(req, res) {
  db.raw('INSERT INTO interviewer (full_name) VALUES ($1)', [req.interviewer_name]).then(function(response){
      res.status(201).send(response);
    })
    .catch(function(err){
      res.status(401).send(err);
  })
}

Interviewer.deleteTable = function(){
  db.raw('TRUNCATE TABLE interviewers');
  return Promise.resolve();
}

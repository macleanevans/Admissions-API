var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../../DB/database.js')
var util = require('util')

var Interview = module.exports;



Interview.create = function(req, res){
  console.log("creat function is running")
  var userEmail = req.body.email
  var decision = req.body.decision_id
  var technicalGrade = req.body.technical_grade;
  var personalGrade = req.body.personal_grade;
  var makerPrep = req.body.maker_prep;
  var notes = req.body.notes;
  var interviewer = req.body.interviewer_name

  db('users').select("user_id").where("email", userEmail)
  .then(function(user){
    console.log("user", user)
  })
}


Interview.deleteTable = function() {
  return db.raw('truncate table interviews cascade')
}

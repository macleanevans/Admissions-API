var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../../DB/database.js')
var util = require('util')

var Interview = module.exports;

// TODO: update to work with new schema

Interview.create = function(req, res){
  
  var data = {
    decision        : req.body.decision,
    technical_grade : req.body.technicalGrade,
    personal_grade  : req.body.personalGrade,
    technical_notes : req.body.technicalGradeNotes,
    personal_notes  : req.body.personalGradeNotes,
    decision_notes : req.body.decisionNotes
  }

  var interviewerName = req.body.interviewerName
  var userEmail       = req.body.userEmail;
  var interviewerID, userID;

  db('users')
   .select("user_id")
   .where("email", userEmail)
    .then(function(user){
      userID = user[0].user_id
      return db('interviewer')
       .select("interviewer_id")
       .where("full_name", interviewerName)
    })
    .then(function(interviewer){
      // TODO: interviewer[0] is undefined atm
      // I think I need to add fellows to the thing
      interviewerID = interviewer[0].interviewer_id;
      return db('interviews')
       .insert(data)    
    })
    .then(function(response){
      return db('interviews')
       .select("*")
       .where("user_id", userID)
    })
    .then(function(response){
      res.status(201).send(response)
    })
    .catch(function(err){
      console.log("error in catch in create interview", arguments)
      res.status(404).send(err)
    })
}


Interview.deleteTable = function() {
  return Promise.resolve(db.raw('truncate table interviews cascade'))
}

var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../../DB/database.js')
var util = require('util')

var Interview = module.exports;



Interview.create = function(req, res){
  var decision = req.body.decision
  var technicalGrade = req.body.technicalGrade;
  var personalGrade = req.body.personalGrade;
  var makerPrep = req.body.makerPrep;
  var notes = req.body.notes;
  var interviewerID;

  db('users').select("user_id").where("email", req.body.userEmail)
  .then(function(user){
    userID = user[0].user_id
    return db('interviewer').select("interviewer_id").where("full_name", req.body.interviewer_name)
  })
  .then(function(interviewer){
    interviewerID = interviewer[0].interviewer_id;
    return db('interviews').insert({user_id: userID, interviewer_id: interviewerID, decision: decision, technical_grade: technicalGrade, personal_grade: personalGrade, maker_prep: makerPrep, notes: notes})    
  })
  .then(function(response){
    return db('interviews').select("*").where("user_id", userID)
  })
  .then(function(response){
    res.status(201).send(response)
  })
  .catch(function(err){
    res.status(404).send(err)
  })
}


Interview.deleteTable = function() {
  return Promise.resolve(db.raw('truncate table interviews cascade'))
}

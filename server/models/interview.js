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
    decision_notes : req.body.decisionNotes,
    interviewer_id: '',
    user_id: ''
  }

  var interviewerName = req.body.interviewerName
  var userEmail       = req.body.userEmail;

  db('users')
   .select('user_id')
   .where('email', userEmail)
    .then(function(user){
      data.user_id = user[0].user_id
      return db('interviewer')
       .select('interviewer_id')
       .where('full_name', interviewerName)
    })
    .then(function(interviewer){
      data.interviewer_id = interviewer[0].interviewer_id;
      return db('interviews')
       .insert(data)
    })
    .then(function(response){
      return db('interviews')
       .select('*')
       .where('user_id', data.user_id)
    })
    .then(function(response){
      res.status(201).send(response)
    })
    .catch(function(err){
      console.log('error in catch in create interview', arguments)
      res.status(404).send(err)
    })
}


Interview.getByGithub = function(req, res){
  
  var githubId = req.params.githubId

  db('users')
    .select('user_id')
    .where('github', githubId)
    .then(function(userRow){
      if(userRow.length === 0)
        return []

      var user_id = userRow[0].user_id
      return db('interviews')
        .select('*')
        .where('user_id', user_id)
    })
    .then(function(response){
      res.status(200).send(response)
    })
    .catch(function(err){
      console.log('error in catch in create interview', arguments)
      res.status(404).send(err)
    })
}


Interview.deleteTable = function() {
  return Promise.resolve(db.raw('truncate table interviews cascade'))
}

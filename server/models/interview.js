var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../../DB/database.js')
var util = require('util')

var Interview = module.exports;



Interview.create = function(req, res){
    db.raw('INSERT INTO interviews (user_id, interviewer_id, decision_id, technical_grade, personal_grade, maker_prep_id, notes)  SELECT user_id, interviewer_id, decision_id, technical_grade, personal_grade, maker_prep_id, $1 FROM users, interviewer, decision, grades tech, grades personal, maker_prep WHERE users.email = $2 AND interviewer.full_name = $3 AND decision.descripition = $4 AND tech.description = $5 AND personal.description = $6 AND maker_prep.description = $7 ', [req.notes, req.email, req.interviewer, req.decision, req.technicalGrade, req.personalGrade, req.makerPrep]).then(function(response){
        res.status(201).send(response);
    }).catch(function(err){
      res.status(401).send(err);
   })
  }

Interview.showAll = function(req, res){
  //show all interviews by user
    db.raw('SELECT interview_id FROM interviews WHERE users.email = $1', [req.email]).then(function(response){
      if(response.rows.length === 0){
        res.status(200).send({message: "No interviews by this user...yet"})
      } else {
        res.status(200).send(response.rows);
        }
  }).catch(function(err){
    res.status(401).send(err);
  })
}


Interview.deleteTable = function() {
  db.raw('TRUNCATE TABLE interviews')
  return Promise.resolve();
}

var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../lib/db.js')
var util = require('util')

var Interview = module.exports;



Interview.create = function(req, res){
  client.query('INSERT INTO interviews (user_id, interviewer_id, decision_id, technical_grade, personal_grade, maker_prep_id, notes)  SELECT user_id, interviewer_id, decision_id, technical_grade, personal_grade, maker_prep_id, $1 FROM users, interviewer, decision, grades tech, grades personal, maker_prep WHERE users.email = $2 AND interviewer.full_name = $3 AND decision.descripition = $4 AND tech.description = $5 AND personal.description = $6 AND maker_prep.description = $7 ', [req.notes, req.email, req.interviewer, req.decision, req.technicalGrade, req.personalGrade, req.makerPrep], , function(err, response){
    if(err){
      res.status(401).send()
    } else {
      res.status(201).send()
    }

  })
}


Interview.deleteEverything = function() {
  counter = 0;
  ticketsDB = {};
  return Promise.resolve();
}

Interview.HardReject = function HardReject(message) {
  Error.captureStackTrace(this, this.constructor)
  this.name = 'HardReject'
  this.message = 'An issue has been raised about your application, please contact addmissions'
}
util.inherits(Interview.HardReject, Error)

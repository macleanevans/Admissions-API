var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../lib/db.js')
var util = require('util')
var TestDB = require('../../DB/database.js')

var Interview = module.exports;



Interview.create = function(req, res){
  pg.connect(TestDB.connectString, function(err, client, done){
    client.query('INSERT INTO interviews (user_id, interviewer_id, decision_id, technical_grade, personal_grade, maker_prep_id, notes)  SELECT user_id, interviewer_id, decision_id, technical_grade, personal_grade, maker_prep_id, $1 FROM users, interviewer, decision, grades tech, grades personal, maker_prep WHERE users.email = $2 AND interviewer.full_name = $3 AND decision.descripition = $4 AND tech.description = $5 AND personal.description = $6 AND maker_prep.description = $7 ', [req.notes, req.email, req.interviewer, req.decision, req.technicalGrade, req.personalGrade, req.makerPrep], function(err, response){
      if(err){
        done();
        res.status(401).send(err);

      } else {
        done();
        res.status(201).send(response);
      }
    })
  })
}

Interview.showAll = function(req, res){
  //show all interviews by user
  pg.connect(TestDB.connectString, function(err, client, done){
    client.query('SELECT interview_id FROM interviews WHERE users.email = $1', [req.email], function(err, response){
      if(err){
        done();
        res.status(401).send();
      } else if(response.rows.length === 0){
        done();
        res.status(200).send({message: "No interviews by this user...yet"})
      } else {
        done();
        res.status(200).send(response.rows);
        }
      })
    })
}


// Interview.deleteEverything = function() {
//   counter = 0;
//   ticketsDB = {};
//   return Promise.resolve();
// }
//
// Interview.HardReject = function HardReject(message) {
//   Error.captureStackTrace(this, this.constructor)
//   this.name = 'HardReject'
//   this.message = 'An issue has been raised about your application, please contact addmissions at admissions@makersquare.com'
// }
// util.inherits(Interview.HardReject, Error)

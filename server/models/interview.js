var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../lib/db.js')
var util = require('util')

var Interview = module.exports;



Interview.create = function(req, res){
  client.query('INSERT INTO interviews (user_id, interviewer_id, decision, technical_grade, personal_grade, maker_prep, notes) VALUES ', function(err, response){
    //Need to run Select statments for all the foreign keys we are placing in
    INSERT INTO bar (description, foo_id) VALUES
    ( 'testing',     (SELECT id from foo WHERE type='blue') ),
    ( 'another row', (SELECT id from foo WHERE type='red' ) );
  })
}

INSERT INTO interviews (user_id, interviewer_id, decision, technical_grade, personal_grade, maker_prep, notes) VALUES
( '')

user_id INTEGER,
interviewer_id INTEGER,
decision INTEGER,
technical_grade INTEGER,
personal_grade  INTEGER,
maker_prep  INTEGER,
notes varchar(250),
PRIMARY KEY (interview_id)




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

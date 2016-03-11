var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../lib/db.js')
var util = require('util')

var Interview = module.exports;



Interview.create = function(req, res){
  client.query('INSERT INTO interviews', function(err, response){
    //Need to run Select statments for all the foreign keys we are placing in
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

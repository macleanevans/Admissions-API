var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../lib/db.js')
var util = require('util')

var Interview = module.exports;

var interview_storage
 = {}; // will be postgres
var counter = 0;

Interview.create = function(interview) {
  if (allowNewInterview(interview)) {
    interview_storage[counter] = interview
    interview.id = counter
    interview.status = 'open'
    counter++
    return Promise.resolve(interview)
  } else {
    return Promise.reject(new Interview.GreedyUser())
  }
}

Interview.fetch = function(id) {
  return Promise.resolve(interview_storage[id])
}

//
// Custom errors
//
Ticket.GreedyUser = function GreedyUser(message) {
  Error.captureStackTrace(this, this.constructor)
  this.name = 'GreedyUser'
  this.message = 'too_many_open_interview_storage'
}
util.inherits(Ticket.GreedyUser, Error)

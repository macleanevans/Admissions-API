var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../lib/db.js')
var util = require('util')

var Ticket = module.exports;

var tickets = {}; // will be postgres
var counter = 0;

Ticket.create = function(ticket) {
  if (allowNewTicket(ticket)) {
    tickets[counter] = ticket
    ticket.id = counter
    ticket.status = 'open'
    counter++
    return Promise.resolve(ticket)
  } else {
    return Promise.reject(new Ticket.GreedyUser())
  }
}

Ticket.fetch = function(id) {
  return Promise.resolve(tickets[id])
}

Ticket.close = function(id) {
  var ticket = tickets[id]
  if (ticket && ticket.status === 'open') {
    ticket.status = 'closed'
    return Promise.resolve(ticket)
  } else {
    return Promise.reject(new Ticket.BadOperation())
  }
}

Ticket.cancel = function(id) {
  var ticket = tickets[id]
  if (ticket && ticket.status === 'open') {
    ticket.status = 'cancelled'
    return Promise.resolve(ticket)
  } else {
    return Promise.reject(new Ticket.BadOperation())
  }
}

Ticket.deleteEverything = function() {
  counter = 0;
  tickets = {};
  return Promise.resolve()
}


// local helper functions

function allowNewTicket (ticket) {
  for (var key in tickets) {
    if (tickets[key].user === ticket.user && tickets[key].status === 'open') {
      return false;
    }
  }
  return true;
}


//
// Custom errors
//
Ticket.GreedyUser = function GreedyUser(message) {
  Error.captureStackTrace(this, this.constructor)
  this.name = 'GreedyUser'
  this.message = 'too_many_open_tickets'
}
util.inherits(Ticket.GreedyUser, Error)

Ticket.BadOperation = function BadOperation(message) {
  Error.captureStackTrace(this, this.constructor)
  this.name = 'BadOperation'
  this.message = 'Operation not allowed, or does not apply'
}
util.inherits(Ticket.BadOperation, Error)

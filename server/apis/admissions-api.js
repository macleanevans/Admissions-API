var express = require('express')
var MP      = require('node-makerpass')
var API     = require('../lib/api-helpers')
var Ticket = require('../models/ticket.js')

var router = module.exports = express.Router({ mergeParams: true })

router.post('/', function (req, res) {
  Ticket.create({
    user: req.user,
    ip: req.ip,
    question: req.body.question,
    group: req.params.group_uid
  })
  .then(function(ticket) {
    res.status(201).send(ticket);
  })
  .catch( Ticket.GreedyUser, API.prep(400, res) )
  .catch( API.catchErrors(res) )
})


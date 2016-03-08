var express = require('express')
var MP      = require('node-makerpass')
var API     = require('../lib/api-helpers')
var Interview = require('../models/interview.js')

var router = module.exports = express.Router({ mergeParams: true })

router.post('/', function (req, res) {
  Interview.create({
    user: req.user,
    ip: req.ip,
    date: req.body.date,
    blackout: req.body.blackout,
    technical_grade: req.body.technical_grade,
    personal_grade: req.body.personal_grade,
    decision: req.body.decision,
    MakerPrep: req.body.mkp
  })
  .then(function(interview) {
    res.status(201).send(interview);
  })
  // .catch( Interview.GreedyUser, API.prep(400, res) )
  .catch( Interview.HardReject, API.prep(400, res))
  .catch( API.catchErrors(res) )
})

router.get('/:id', function(req, res){
  console.log("hopeful id", req.params.id)
  Interview.fetch(req.params.id)
    .then(function(interview) {
    res.status(200)
    res.send(interview)
  })
  .catch( API.catchErrors(res))
})

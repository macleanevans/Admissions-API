var express = require('express')
var MP      = require('node-makerpass')
var API     = require('../lib/api-helpers')
var Interview = require('../models/interview.js')

var router = module.exports = express.Router({ mergeParams: true })

router.post('/', function (req, res) {
  Interview.create({
    user: req.user,
    ip: req.ip,
    name: req.body.name,
  })
  .then(function(interview) {
    res.status(201).send(interview);
  })
  // .catch( Interview.GreedyUser, API.prep(400, res) )
  .catch( API.catchErrors(res) )
})

// router.get('/', function(req, res){
//   res.status(200)
//   .catch( API.catchErrors(res))
// })

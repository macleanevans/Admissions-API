var express = require('express')
var MP      = require('node-makerpass')
var API     = require('../lib/api-helpers')
var Interview = require('../models/interview.js')
var Users = require('../models/users.js')

var router = module.exports = express.Router({ mergeParams: true })

//WEB hook URL
"http://example.com/api/crm/AppointmentCreated?name={applicant_name}&email={email}&github={github}"


router.get('/:id', function(req, res){
  //get all interviews by a user id
  Interview.showAll(req, res);
})


router.post('/create', function(req, res){
  //create an interviw
  Interview.create(req, res);
})

router.post('/interviewer', function(req, res) {
  Interviewer.create(req, res);
})

router.post('/blackout/:id', function(req, res){
  Users.setBlackout(req, res);
})

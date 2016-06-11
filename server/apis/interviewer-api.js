var express = require('express')
var MP      = require('node-makerpass')
var API     = require('../lib/api-helpers')
var Interviewer = require('../models/interviewer.js')

var router = module.exports = express.Router({ mergeParams: true })

//WEB hook URL
// "http://example.com/api/crm/AppointmentCreated?name={applicant_name}&email={email}&github={github}"

router.post('/create', function(req, res) {
  Interviewer.create(req, res);
})

router.get('/all', function(req, res) {
  Interviewer.retrieve(req, res);
})

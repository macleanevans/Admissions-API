var express = require('express')
var MP      = require('node-makerpass')
var API     = require('../lib/api-helpers')
var Interview = require('../models/interview.js')

var router = module.exports = express.Router({ mergeParams: true })

//WEB hook URL
"http://example.com/api/crm/AppointmentCreated?name={applicant_name}&email={email}&github={github}"


router.get('/:id', function(req, res){
  //get all interviews by a user id
  Interview.showAll(req, res);
})

router.post('/create', function(req, res){
  //create an interviw
  console.log("hit create")
  Interview.create(req, res);
})

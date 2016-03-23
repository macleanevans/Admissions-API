
// router.get('/:user_uid/interviews', ...)
// router.get('/search', ...)
var express = require('express')
var MP      = require('node-makerpass')
var API     = require('../lib/api-helpers')
var Users = require('../models/users.js')

var router = module.exports = express.Router({ mergeParams: true })

//WEB hook URL
// "http://example.com/api/crm/AppointmentCreated?name={applicant_name}&email={email}&github={github}"

// /api/users/search
router.get('/', function (req, res) {
  //need to figure out how to section of the sent url into a req object
  Users.check(req,res)
})

router.get('/applicants', function(req, res){
  console.log("hey")
  //Get all usernames
  Users.getAll(req, res);
})

router.post('/blackout/:id', function(req, res){
  Users.setBlackout(req, res);
})


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
  Users.check(req,res)
})

router.get('/all', function(req, res){
  console.log("hit the all route")
  Users.getAll(req, res)
})

router.post('/blackout', function(req, res){
  Users.setBlackout(req,res);
})

router.get('/:id', function(req, res){
  Users.get
})

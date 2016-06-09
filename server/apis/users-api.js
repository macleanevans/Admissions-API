
// router.get('/:user_uid/interviews', ...)
// router.get('/search', ...)
var express = require('express')
var MP      = require('node-makerpass')
var API     = require('../lib/api-helpers')
var Users = require('../models/users.js')

var router = module.exports = express.Router({ mergeParams: true })

//WEB hook URL
// "http://example.com/api/crm/AppointmentCreated?name={applicant_name}&email={email}&github={github}"

router.get('/check', function (req, res) {
  Users.check(req,res)
})

router.post('/findOrCreate', function (req, res) {
  Users.findOrCreate(req,res)
})

router.get('/all', function(req, res){
  Users.getAll(req, res)
})

router.post('/blackout', function(req, res){
  Users.setBlackout(req,res);
})

router.get('/search', function(req, res){
  Users.interviewsByUser(req,res);
})

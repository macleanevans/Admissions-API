var express = require('express')
var MP      = require('node-makerpass')
var API     = require('../lib/api-helpers')
var Interview = require('../models/interview.js')
var Users = require('../models/users.js')

var router = module.exports = express.Router({ mergeParams: true })

//WEB hook URL
"http://example.com/api/crm/AppointmentCreated?name={applicant_name}&email={email}&github={github}"

router.get('/', function (req, res) {
  Users.check(req,res)
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

router.post('/blackout/:id', function(req, res){

})

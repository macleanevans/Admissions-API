var express = require('express')
var helper  = require('../lib/api-helpers')

var routes = module.exports = express.Router()
var port = process.env.PORT || 4000
var host = process.env.HOST || 'http://localhost:' + port

// API Routes
var API = require('../lib/api-helpers')

routes.use('/me',
  API.authSession(),
  require('../apis/account-api')
)

routes.use('/interview',
 API.authSession({ redirectOnFailure: '/login' }),
 require('../apis/interview-api')
)

routes.use('/users',
  API.authSession({ redirectOnFailure: '/login' }),
  require('../apis/users-api')
)

routes.use('/interviewer',
  require('../apis/interviewer-api')
)

routes.use('/groups/:group_uid/status',
  API.fetchGroups,
  API.authMembership('group_uid'),
  require('../apis/status-api')
)

routes.get('/*', function(req, res) {
  res.status(404).send({ reason: 'No such API endpoint' }) 
})

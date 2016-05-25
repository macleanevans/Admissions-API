var Path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
var browserify = require('browserify-middleware')
var pg = require('pg');
var connectString = process.env.DATABASE_URL || 'postgres://localhost:5432/test';


var routes = express.Router()
var port = process.env.PORT || 4000
var host = process.env.HOST || 'http://localhost:' + port

// API Routes
var API = require('./lib/api-helpers')

routes.get('/', 
  API.authSession({ redirectOnFailure: '/login' }), 
  function(req, res){ 
    res.sendFile( assetFolder + '/index.html' ) 
  }
)

routes.use('/api/me',
  API.authSession(),
  require('./apis/account-api')
)

routes.use('/api/interview',
 API.authSession({ redirectOnFailure: '/login' }),
 require('./apis/interview-api')
)

routes.use('/api/users',
  API.authSession({ redirectOnFailure: '/login' }),
  require('./apis/users-api')
)

routes.use('/api/interviewer',
  require('./apis/interviewer-api')
)

routes.use('/api/groups/:group_uid/status',
  API.fetchGroups,
  API.authMembership('group_uid'),
  require('./apis/status-api')
)

routes.get('/api/*', function(req, res) {
  res.status(404).send({ reason: 'No such API endpoint' }) 
})


if (process.env.NODE_ENV !== 'test') {
  // The Catch-all Route
  // This is for supporting browser history pushstate.
  // NOTE: Make sure this route is always LAST.
  routes.get('/*', function(req, res){
    res.sendFile( assetFolder + '/index.html' )
  })

  // We're in development or production mode;
  // create and run a real server.
  var app = express()

  // Sessions
  var session = require('cookie-session')
  app.use(session({
    name: 'learn:session',
    secret: process.env.SESSION_SECRET || 'development',
    secure: (!! process.env.SESSION_SECRET),
    signed: true
  }))

  // Parse incoming request bodies as JSON
  app.use( bodyParser.json() )

  // Configure Auth Strategies
  require('./makerpass').mount(app, host)

  // Serve JavaScript Assets
  app.get('/app-bundle.js',
    browserify('./client/app.js'))

  // Mount our main router
  app.use('/', routes)

  // Serve Static Assets
  var assetFolder = Path.resolve(__dirname, '../client/public')
  app.use(express.static(assetFolder))

  // Start the server!
  app.listen(port)
  console.log("Listening on port", port)
}
else {
  // We're in test mode; make this file importable instead.
  module.exports = routes
}

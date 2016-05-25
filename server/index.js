var Path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
var browserify = require('browserify-middleware')
var pg = require('pg');
var connectString = process.env.DATABASE_URL || 'postgres://localhost:5432/test';

// API Routes
var API = require('./lib/api-helpers')

var port = process.env.PORT || 4000
var host = process.env.HOST || 'http://localhost:' + port

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
app.use('/api', require('./apis/root-api'))

// Don't check auth for /login
app.get('/login', 
  function(req, res){ 
    res.sendFile( assetFolder + '/index.html' ) 
  }
)

// The Catch-all Route
// This is for supporting browser history pushstate.
// NOTE: Make sure this route is always LAST.
app.get('/*', 
  API.authSession({ redirectOnFailure: '/login' }),
  function(req, res){
    res.sendFile( assetFolder + '/index.html' )
  }
)

// Serve Static Assets
var assetFolder = Path.resolve(__dirname, '../client/public')
app.use(express.static(assetFolder))

// Start the server!
app.listen(port)
console.log("Listening on port", port)


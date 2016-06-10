var m = require('mithril')
var Interview = require('./components/interviewer')
var Login = require('./components/login')
var Form = require('./components/detailsForm')
var Search = require('./components/searchApplicants')

//
// Global variable for global state (e.g. currentUser)
//
window.App = {}


// Store list of interviewers in the global variable
m.request({
  method: 'GET',
  url: "/api/interviewer/all"
})
.then(function(results){
  window.App.interviewers = results.map(a => a.full_name)
})

//
// Client-side routing
//
m.route.mode = 'pathname'
m.route(document.getElementById('app'), '/', {
  '/': Interview,
  '/login': Login,
  '/form': Form,
  '/search': Search
})

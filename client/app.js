var m = require('mithril')
var Interview = require('./components/interviewer')
var Login = require('./components/login')
var Form = require('./components/detailsForm')

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

  '/': {
    // Controllers are optional
    // controller: function () {},

    view: function (ctrl) {
      return m('.app', [
        // m('h1', 'Post interview report'),
        m.component(Interview, { title: 'Post interview report' })
      ])
    }
  },
  '/login': Login,
  '/form': Form
})

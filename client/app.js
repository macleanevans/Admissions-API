var m = require('mithril')
var Interview = require('./components/interviewer')
var Login = require('./components/login')
var Form = require('./components/detailsForm')

//
// Global variable for global state (e.g. currentUser)
//
window.App = {}

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

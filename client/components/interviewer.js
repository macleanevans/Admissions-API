var m = require('mithril')
var Users = require('../models/Users')
var Menu = require('./menu')

module.exports.controller = function (options) {
  var ctrl = this;
  ctrl.user = {};
  
  ctrl.lookUpUser = function(){
    /*
    // Check if user exists in DB
    //    if yes: Open other forms for interview info
    //    if no: ask if they want to enter it manually (if yes proceed)

    //pseudocode
    isAKnownApplicant(ctrl.user)
      .then(function(results){
        if(results.exists || confirm('User not found, would you like to create a new one?'))
          window.location.href = '/form' || m.route('/form')
        else
          alert("Please try again.")
          // This will eventually be a modal or something
          // for now I want to know when it happens.
      })
      .catch(function(err){
        if(err)
          console.log("Error while doing user lookup in interviewer.js")
      })
    */
    m.route('/form')
  }
}

module.exports.view = function (ctrl, options) {

  return m('span', [
    m(Menu),
    m('span.content', [
      m('h1', 'Document your Interview'),
      m('form', {
        onsubmit: function(e){
          e.preventDefault();
          ctrl.user.github = e.currentTarget.getElementsByClassName('github')[0].value;
          ctrl.user.name   = e.currentTarget.getElementsByClassName('name')[0].value;
          ctrl.user.email  = e.currentTarget.getElementsByClassName('email')[0].value;
          ctrl.lookUpUser();
        }
      },[
        m('input.github[placeholder="Github Handle"]'),
        m('br'),
        m('input.name[placeholder="Name"]'),
        m('br'),
        m('input.email[placeholder="Email"]'),
        m('br'),
        m('button[type=submit]', 'Submit')
      ]),
    ])
  ])
}


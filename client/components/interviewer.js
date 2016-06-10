var m = require('mithril')
var Menu = require('./menu')

module.exports.controller = function (options) {
  var ctrl = this;
  ctrl.user = {};

  ctrl.lookUpUser = function(){
    // Check if user exists in DB
    //    if yes: Open other forms for interview info
    //    if no: ask if they want to enter it manually (if yes proceed)
    m.request({
      method: "GET",
      url: "/api/users/check",
      data: ctrl.user
    })
    .then(function(results){
      App.userInfo = results
      m.route('/form')
    })
    .catch(function(err){
      if(err.message === "User was not found.") {
        if(confirm('User not found, would you like to create a new one?')) {
          m.request({
            method: "POST",
            url: "/api/users/findOrCreate",
            data: ctrl.user
          })
          .then(function(results){
            App.userInfo = results
            m.route('/form')
          })
          .catch(function(results){
            console.log("bad stuff happened in lookUpUser. arguments: ",arguments)
          })
        } else {
          console.log("User didn't want to create a new student.")
        }
      } else {
        console.log("Error while doing user lookup in interviewer.js", arguments)
      }
    })
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

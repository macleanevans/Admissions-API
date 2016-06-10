var m = require('mithril')

module.exports.controller = function (options) {
  var ctrl = this;
  ctrl.authenticate = function(){
    window.location.href = "/auth/makerpass"
  }
}

module.exports.view = function (ctrl, options) {
  return m('.auth-container', [
    m('div', "You are not signed in."),
    m("button[type=button]", {
      class: "button-ghost",
      onclick: ctrl.authenticate
    }, "Sign In")
  ])
}

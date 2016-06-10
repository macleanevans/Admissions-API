var m = require('mithril')

module.exports.controller = function (options) {
  var ctrl = this;
  ctrl.signout = function(){
    window.location.href = "/signout"
  }
}

module.exports.view = function (ctrl, options) {
  return m('.auth-container', [
    m('div', "You are not authorized to view this site."),
    m("button[type=button]", {
      class: "button-ghost",
      onclick: ctrl.signout
    }, "Sign Out")
  ])
}

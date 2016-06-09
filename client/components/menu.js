var m = require('mithril')

module.exports = {
  view: function(ctrl){
    return m('span.sidebar', {config: persistent}, [
      m('img.profile-picture[src='+getCookie('picture')+']'),
      m('div.profile-name', getCookie('name')),
      m('button', {
        class: "button-ghost",
        onclick:function(){
          window.location.href = '/signout'
        }
      }, "Sign Out")
    ])
  }
}

// Configuration that persists across route changes
function persistent(el, isInit, context) {
  context.retain = true
}

// Utility to retrieve cookies
function getCookie(name){
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}


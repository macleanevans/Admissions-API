var m = require('mithril')
var Menu = require('./menu')

module.exports.controller = function (options) {
  var ctrl = this;
  ctrl.github = '';
  ctrl.interviews = [];

  ctrl.lookUpUser = function(){
    // Check if user exists in DB
    //    if yes: Open other forms for interview info
    //    if no: ask if they want to enter it manually (if yes proceed)

    m.request({
      method: "GET",
      url: "/api/interview/" + ctrl.github,
    })
    .then(function(results){
      console.log(results)
      ctrl.interviews = results;
      m.redraw()
    })
    .catch(function(err){
      console.log("Error while doing user lookup in interviewer.js", arguments)
    })
  }
}

module.exports.view = function (ctrl, options) {

  return m('span', [
    m(Menu),
    m('span.content', [
      m('h1', 'Search Interviews by Applicant Github'),
      m('form', {
        onsubmit: function(e){
          e.preventDefault();
          ctrl.github = e.currentTarget.getElementsByClassName('github')[0].value;
          ctrl.lookUpUser();
        }
      },[
        m('input.github[placeholder="Github Handle"]'),
        m('button[type=submit]', 'Submit')
      ]),
      m('span.interview-list', [
        ctrl.interviews.map(c=>
          m('span.interview-item', [
            m('div.decision', "Decision:" + c.decision),
            m('div.decision_notes', "Decision Notes:" + c.decision_notes),
            m('div.maker_prep', "Maker Prep:" + c.maker_prep),
            m('div.personal_grade', "Personal Grade:" + c.personal_grade),
            m('div.personal_notes', "Personal Notes:" + c.personal_notes),
            m('div.technical_grade', "Technical Grade:" + c.technical_grade),
            m('div.technical_notes', "Technical Notes:" + c.technical_notes),
            m('div.decision_notes', "Decision Notes:" + c.decision_notes),
            m('div.interviewer_name', "Interviewer Name:" + c.interviewer_name),
            m('br')
          ])
        )
      ])
    ])
  ])
}

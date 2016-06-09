var m = require('mithril')
var Users = require('../models/Users')
var Menu = require('./menu')

// TODO: data validation, post request

module.exports.controller = function (options) {
  var ctrl = this;
  ctrl.interview = {};
}

module.exports.view = function (ctrl, options) {
  var data = ctrl.interview;

  return m('span',[
    m(Menu),
    m('span.content', [
      m('h1', "Interview Details"),
      m('form', {
        onsubmit: function(e){
          e.preventDefault();
          data.name   = e.currentTarget.getElementById("name").value;
          data.email  = e.currentTarget.getElementById("email").value;
          data.interviewer = e.currentTarget.getElementById("interviewer-name").value;
          data.interviewer = e.currentTarget.getElementById("interviewer-name").value;
          data.interviewer = e.currentTarget.getElementById("interviewer-name").value;
          data.interviewer = e.currentTarget.getElementById("interviewer-name").value;
          data.interviewer = e.currentTarget.getElementById("interviewer-name").value;
          data.interviewer = e.currentTarget.getElementById("interviewer-name").value;
          data.interviewer = e.currentTarget.getElementById("interviewer-name").value;
          data.interviewer = e.currentTarget.getElementById("interviewer-name").value;
          data.lookUpUser();
        }
      },[
        m('select#interviewer-name', [
          m('option[value=""]', "-Choose a Fellow-"),
          m('option[value="Mat Kelly"]', "Mat Kelly"),
          m('option[value="Nathan Schwartz"]', "Nathan Schwartz"),
          m('option[value="Patrick Lynch"]', "Patrick Lynch"),
          m('option[value="Patrick Daly"]', "Patrick Daly")
        ]),
        m('br'),
        m('select#interview-decision', {
          onchange: function(e){
            // TODO: is there a better way to grab the value of this select menu
            data.decision = document.getElementById("interview-decision").value
            m.redraw()
          }
        },[
          m('option[value=""]', "-Decision-"),
          m('option[value="Accept"]', "Accept"),
          m('option[value="Conditional Accept"]', "Conditional Accept"),
          m('option[value="Soft Reject"]', "Soft Reject"),
          m('option[value="Hard Reject"]', "Hard Reject")
        ]),

        data.decision !== "Soft Reject"
         ? null 
         : m('input#timeout[type="number"]'),

        m('br'),

        m('input#decision-notes[type="number"placeholder="Why?"]'),

        m('br'),

        m('select#personal-grade', [
          m('option[value=""]', "-Choose a Personal Grade-"),
          m('option[value="A"]', "A"),
          m('option[value="B"]', "B"),
          m('option[value="C"]', "C"),
          m('option[value="D"]', "D"),
          m('option[value="F"]', "F")
        ]),

        m('br'),

        m('input#personal-grade-notes[type="number"placeholder="Why?"]'),

        m('select#technical-grade', [
          m('option[value=""]', "-Choose a Technical Grade-"),
          m('option[value="A"]', "A"),
          m('option[value="B"]', "B"),
          m('option[value="C"]', "C"),
          m('option[value="D"]', "D"),
          m('option[value="F"]', "F")
        ]),

        m('br'),

        m('input#personal-grade-notes[type="number"placeholder="Why?"]'),

        m('br'),

        m('input.name[type="checkbox"]'),
        m('span.name-label', "MakerPrep"),
        m("br"),
        m('button[type=submit]', "Submit")
      ]),
    ])
  ])
}

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
          data.user.name   = e.currentTarget.getElementById("name")[0].value;
          data.user.email  = e.currentTarget.getElementById("email")[0].value;
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
         : m('input.timeout[type="number"]'),

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

        m('select#technical-grade', [
          m('option[value=""]', "-Choose a Technical Grade-"),
          m('option[value="A"]', "A"),
          m('option[value="B"]', "B"),
          m('option[value="C"]', "C"),
          m('option[value="D"]', "D"),
          m('option[value="F"]', "F")
        ]),

        m('br'),
        
        // TODO: Do notes need to be categorized based on exercise? 
        m('input#interview-notes[placeholder="Notes"]'),
        m("br"),
        m('input.name[type="checkbox"]'),
        m('span.name-label', "MakerPrep"),
        m("br"),
        m('button[type=submit]', "Submit")
      ]),
    ])
  ])
}
// <div id="app" class = "container">
//   <div class = "container">
//     <div class = "jumbtron">
//       <h1> (This persons) post interview report</h1>
//       <p>
//         Date
//       </p>
//     </div>
//     <div class = "container">
//       <form>
//         Interviewee Full Name:<br>
//         <input type="text" name="fullname"><br>
//         Email:<br>
//         <input type="text" name="email">
//       </form>
//     </div>
//     <div class = "container">
//       <form>
//         Select interviewer name: <br>
//         <select name="Interviewer">
//           <!-- we are going to have to repeat all current fellows in the DB here as options -->
//           <option value="mac">Mac Evans</option>
//         </select>
//         <br><br>
//       </form>
//     </div>
//     <div class = "container">
//       <div class = "row">
//         <div class = "col-md-6">
//           Technical Grade: <br />
//           <select name="technicalGrade">
//             <option value = "A">A</option>
//             <option value = "B">B</option>
//             <option value = "C">C</option>
//             <option value = "D">D</option>
//             <option value = "F">F</option>
//           </select>
//         </div>
//         <div class = "col-md-6">
//           Personal Grade: <br />
//           <select name = "personalGrade">
//             <option value = "A">A</option>
//             <option value = "B">B</option>
//             <option value = "C">C</option>
//             <option value = "D">D</option>
//             <option value = "F">F</option>
//           </select>
//         </div>
//       </div>
//     </div>
//     <div class="container">
//       Decision:
//       <option value = "Accept">Accept</option>
//       <option value = "Soft Reject">Soft Reject</option>
//       <option value = "Hard Reject">Hard Reject</option>
//     </div>
//   </div>
// </div>

//This front end will serve as a replacement for the google docs after interview sheet

//First Input field will be an input of the email(user entry)
//Next will be the fellow who interviewed them (Dropdown selection of full names of all current fellows)
//Next will be a decision input (dropdown with options "accept, soft reject, hard reject")
//Next will be a input box that is hidden unless decision is selected as soft reject(it will then have a calendar dropdown of when they were told to wait until)
//Next input field will be Technical grade (pulldown of options"A, B, C, D, F")
//Next is a input field with personal grade (See above)
//Next will be a makerPrep field with a yes no dropdown
//Final field will be a notes input that should look like gilberts short answer on makerpass
//Submit button with a check that all fields are completed

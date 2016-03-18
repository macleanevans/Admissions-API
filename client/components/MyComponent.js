var m = require('mithril')

exports.controller = function (options) {}

exports.view = function (ctrl, options) {
  return m('.my-component', [
    m('h2', options.title)
  ])
}

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

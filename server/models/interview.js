var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../lib/db.js')
var util = require('util')

var Interview = module.exports;

var interview_storage = {}; // will be postgres
var counter = 0;

Interview.create = function(interview) {
  console.log("PR test", priorReject(interview.user.uid))
  console.log("CB test", checkedBlackout(interview.user.uid))
  var uid = interview.user.uid
   if(priorReject(uid) && checkedBlackout(uid)){
    interview_storage[counter] = interview
    interview.id = counter
    counter++
    console.log("Created Interview", interview)
    return Promise.resolve(interview)
  } else {
    return Promise.reject(new Interview.HardReject())
  }
}

Interview.fetch = function(id) {
  return Promise.resolve(interview_storage[id])
}

function priorReject (id){
  //Need to pass this the userID
  if(Object.keys(interview_storage).length === 0){
    return true
  }
  for(var key in interview_storage){
    if(interview_storage[key].user.uid == id && interview_storage[key].decision === "HR"){
      return false
    } else return true
  }
}

function checkedBlackout (id){
    //Need to check if the blackout plus last interview date in comparison to current date
    //If blackout date is greater then return false
    //Else reset the blackout to 0 and return true
    //Currend date var utc = new Date().toJSON().slice(0,10);
    var mostCurrentInterview;
    if(Object.keys(interview_storage).length === 0){
      return true
    }
    for(var key in interview_storage){
      console.log("IS userID", interview_storage[key].user.uid)
      console.log("IS Blackout", interview_storage[key].blackout)
      console.log("IS", interview_storage)


        var year = Number(interview_storage[key].date.slice(0,4))
        var month = Number(interview_storage[key].date.slice(5,7))
        if(mostCurrentInterview === undefined){
          mostCurrentInterview = interview_storage[key]
        } else if(month > Number(mostCurrentInterview.date.slice(5,7)) && year > Number(mostCurrentInterview.date.slice(0,4))){
         mostCurrentInterview = interview_storage[key]
        }

    }
    if(mostCurrentInterview.blackout === undefined){
      return true
    }
    var blackoutPeriod;
    console.log("mostCurrentInt", mostCurrentInterview)
    var blackoutPlusCurrentMonth = Number(mostCurrentInterview.date.slice(5,7)) + mostCurrentInterview.blackout
    if(blackoutPlusCurrentMonth > 12){
      var blackoutPeriodYear = Number(mostCurrentInterview.date.slice(0,4)) + 1
      var blackoutPeriodMonth = Number(mostCurrentInterview.date.slice(5,7)) - 12
      blackoutPeriod = blackoutPeriodYear + "-" + blackoutPeriodMonth + "-" + mostCurrentInterview.date.slice(7)
    }
    var today = new Date().toJSON().slice(0,10)
    console.log("today", today);
    console.log("blackoutPeriod", blackoutPeriod)
    if(Number(today.slice(0,4)) < Number(blackoutPeriod.slice(0,4))){
      return true
    } else if(Number(today.slice(5,7)) <= Number(blackoutPeriod.slice(5,7))){
      return true
    } else {
      return false
    }
}

//
// Custom errors
//



Interview.deleteEverything = function() {
  counter = 0;
  ticketsDB = {};
  return Promise.resolve();
}

Interview.HardReject = function HardReject(message) {
  Error.captureStackTrace(this, this.constructor)
  this.name = 'HardReject'
  this.message = 'An issue has been raised about your application, please contact addmissions'
}
util.inherits(Interview.HardReject, Error)

var db = require('../lib/db.js')
var Model = require('../lib/create-model.js')

var log = {};

var EventLog = module.exports

EventLog.create = function (group_uid, event) {
  log[group_uid].push(event)
}

EventLog.all = function (group_uid)  {

}

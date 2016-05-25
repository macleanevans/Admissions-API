var Users = module.exports;
var m = require('mithril')

Users.fetchAll = function(){
  console.log("fetchAll runnning")
  return m.request({method: 'GET', url: 'api/users/all'})
}

var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../lib/db.js')
var util = require('util')
var pg = require('pg')
var TestDB = require('../../DB/database.js')

var Users = module.exports;

Users.check = function(email){
  pg.connect(TestDB.connectString, )
}

Users.create = function(req){

}

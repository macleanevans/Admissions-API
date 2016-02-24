var fs      = require('fs')
var path    = require('path')
var Promise = require('bluebird')

// Read config file
// var config = require('../../knexfile.js')

// // Configure knex with correct environment values
// var env = process.env.NODE_ENV || 'development'
// var db = require('knex')(config[env])

// // Export the db object, which will database connections
// module.exports = db

// // Function for testing suite
// db.deleteEverything = function () {
//   if (env != 'test') return Promise.reject();
//   // TODO: Delete data from all tables (useful for testing)
//   // return db('users').truncate()
// }

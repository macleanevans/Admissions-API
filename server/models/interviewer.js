var Promise = require('bluebird')
var Model = require('../lib/create-model.js')
var db = require('../../DB/database.js')
var util = require('util')

var Interviewer = module.exports;


Interviewer.create = function(req, res) {
 return db('interviewer').select().where('full_name', req.body.full_name)
  .then(function(response){
    if(response.length > 0){
      res.status(404).send({message: "Fellow already exists"})
    } else {
       db('interviewer').insert({full_name: req.body.full_name})
         .then(function(response){
           return db('interviewer').select().where('full_name', req.body.full_name)
           .then(function(fellow){
             res.status(201).send(fellow[0])
           })
           .catch(function(err){
             res.status(404).send(err)
           })
         })
         .catch(function(err){
           res.status(404).send(err)
         })
    }
  })
}
//Cant delete because the old interviews would not have an id to reference

// Interviewer.remove = function(req, res) {
//   console.log("req.body", req.body)
//   return db('interviewer').del().where('full_name', req.body.full_name)
//     .then(function(response){
//       console.log("delete a fellow", response);
//       res.status(200).send(response)
//     })
//     .catch(function(err){
//       res.status(404).send(err)
//     })
// }

Interviewer.deleteTable = function() {
  return db.raw('truncate table interviewer cascade')
}

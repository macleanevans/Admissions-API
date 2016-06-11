exports.seed = function(db){
  return db('interviewer').insert({full_name: "Nathan Schwartz"})
    .then(function(){
      return db('interviewer').insert({full_name: "Matthey Kelly"})
    })
    .then(function(){
      return db('interviewer').insert({full_name: "Patrick Daly"})
    })
    .then(function(){
      return db('interviewer').insert({full_name: "Patrick Lynch"})
    })
    .then(function(){
      return db('interviewer').insert({full_name: "Kimberly Kost"})
    })
    .then(function(){
      return db('interviewer').insert({full_name: "Julia Brown"})
    })
    .then(function(){
      return db('interviewer').insert({full_name: "Amberley Romeo"})
    })
}

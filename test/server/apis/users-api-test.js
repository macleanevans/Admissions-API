require(TEST_HELPER) // <--- This must be at the top of every test file.

var request = require('supertest-as-promised')
var routes = require(__server + '/index.js')
var UsersApi = require(__server + '/apis/users-api.js')
var Users = require(__server + '/models/users.js')

describe("The Server", function() {

  var currentUser = null
  var memberedGroups = null
  var session = { admin: null }

  var app = TestHelper.createApp()

  // Simulate a signed-in user with session
  app.use(function(req, res, next) {
    req.user    = currentUser
    req.groups  = memberedGroups
    req.session = session
    next()
  })

  // UsersApi
  // GET  /
  // GET  /applicants
  // POST /blackout/:id

  // ApplicatsApi
  // GET  /
  // POST /

  app.use('/api/users', UsersApi)
  // GET  /api/users
  // GET  /api/users/applicants
  // POST /api/users/blackout/:id
  app.testReady()

  beforeEach_(function * () {
    currentUser = { uid: 'alice', name: 'Alice' }
    memberedGroups = [{ uid: 'g1', user_role: 'fellow' }]

    return Users.deleteTable()
  })

  it_("sends back a 200 if the user isnt already in our system", function * () {

    yield request(app)
      .get('/api/users')
      .send({query: {name: "Gilbert", email: "GGG@makersquare.com", github: "Wizard"}})
      .expect(200)
      .expect(function(response) {
        var user = response.body
        expect(user.name).to.equal("Gilbert");
      })
  })

    it_("should be able to set a blackout period for a user", function * (){
      var user = yield request(app)
        .get('/api/users')
        .send({query: {name: "Gilbert", email: "GGG@makersquare.com", github: "Wizard"}})
        .expect(200)
        .then(function(response){
          return response.body
        })

        yield request(app)
        .post('/api/users/blackout')
        .send({email: user.email , blackout: 2})
        .expect(201)
        .expect(function(response){
          expect(response.blackout).to.not.equal(null)
        })
      })

    it_("should send back 404 if the user is not past their blackout peroid", function * (){

      var user = yield request(app)
       .get('/api/users')
       .send({query: {name: "Gilbert", email: "GGG@makersquare.com", github: "Wizard"}})

      var blackout = yield request(app)
         .post('/api/users/blackout/')
         .send({email: 'GGG@makersquare.com', blackout: 2})
         .expect(201)

      yield request(app)
       .get('/api/users')
       .send({query: {email: 'GGG@makersquare.com'}})
       .expect(404)
       .expect(function(response){
         expect(response.body.message).to.not.equal(undefined)
       })
    })

    it_("sends back a 200 if they are in the system and do not have a blackout", function * (){
      var user = yield request(app)
       .get('/api/users')
       .send({query: {name: "Gilbert", email: "GGG@makersquare.com", github: "Wizard"}})


      yield request(app)
       .get('/api/users')
       .send({query: {email: 'GGG@makersquare.com'}})
       .expect(200)
       .expect(function(response){
         var user = response.body
         expect(user.name).to.equal('Gilbert')
       })
    })

    it_("Should be able to get names of all users in the system", function * (){
      yield request(app)
      .get('/api/users')
      .send({query: {name: "Gilbert", email: "GGG@makersquare.com", github: "Wizard"}})
      .expect(200)

     yield request(app)
     .get('/api/users')
     .send({query: {name: "Mac", email: "me@makersquare.com", github: "maclean"}})
     .expect(200)

     yield request(app)
     .get('/api/all')
     .expect(200)
    })
  //
  //   it_("should be able to get all interviews by one user", function*(){
  //     return request(app)
  //     .get('/api/users/:id')
  //     .send({query: 1})
  //     .expect(200)
  //     .expect(function(response){
  //
  //     })
  //   })

})

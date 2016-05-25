require(TEST_HELPER) // <--- This must be at the top of every test file.

var request = require('supertest-as-promised')
var routes = require(__server + '/apis/root-api.js')
var InterviewApi = require(__server + '/apis/interview-api.js')
var Interview = require(__server + '/models/interview.js')
var Interviewer = require(__server + '/models/interviewer.js')
var Users = require(__server + '/models/users.js')
var UsersApi = require(__server + '/apis/users-api.js')
var InterviewerApi = require(__server + '/apis/interviewer-api.js')

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


  app.use('/api/interview', InterviewApi)
  app.use('/api/users', UsersApi)
  app.use('/api/interviewer', InterviewerApi)
  // GET  /api/users
  // GET  /api/users/applicants
  // POST /api/users/blackout/:id
  app.testReady()

  beforeEach_(function * () {
    currentUser = { uid: 'alice', name: 'Alice' }
    memberedGroups = [{ uid: 'g1', user_role: 'fellow' }]

     Users.deleteTable();
     Interviewer.deleteTable();
     Interview.deleteTable();
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
       .send({query: {name: "Mac", email: "ME@makersquare.com", github: "Maclean"}})
       .expect(function(response){
         user = response.body
       })


      yield request(app)
       .get('/api/users')
       .send({query: {email: "ME@makersquare.com"}})
       .expect(200)
       .expect(function(response){
         var final = response.body
         expect(final.name).to.equal('Mac')
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
     .get('/api/users/all')
     .expect(200)
     .expect(function(response){
       expect(response.body.length).to.not.equal(0)
     })
    })

    it_("should be able to get all interviews by one user", function*(){
      var user = yield request(app)
        .get('/api/users')
        .send({query: {name: "Gilbert", email: "GGG@makersquare.com", github: "Wizard"}})
        .expect(200)
        .expect(function(user){
        })

      var fellow = yield request(app)
      .post('/api/interviewer/create')
      .send({full_name: "Festus Fellow"})
      .expect(201)
      .expect(function(fellow){
      })

      var interview = yield request(app)
      .post('/api/interview/create')
      .send({userEmail: user.body.email,
         interviewer_name: fellow.body.full_name,
         decision: "accept",
         technicalGrade: "A",
         personalGrade: "A",
         makerPrep: "no",
         notes: "This kid knows his stuff"
       })
      .expect(201)
      .expect(function(response){
        expect(response.body[0].technical_grade).to.equal("A")
      })


      yield request(app)
      .get('/api/users/search')
      .send({email: user.body.email})
      .expect(200)
      .expect(function(response){
        expect(response.body.length).to.equal(1)
      })
    })

})

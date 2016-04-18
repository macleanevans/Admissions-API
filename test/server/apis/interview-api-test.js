require(TEST_HELPER) // <--- This must be at the top of every test file.

var request = require('supertest-as-promised')
var routes = require(__server + '/index.js')
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
  app.testReady()

  beforeEach_(function * () {
    currentUser = { uid: 'alice', name: 'Alice' }
    memberedGroups = [{ uid: 'g1', user_role: 'fellow' }]

     Interview.deleteTable()
     Interviewer.deleteTable()
     Users.deleteTable()

  })

  it_("should create a new interview on submit", function * () {
    var user = yield request(app)
      .get('/api/users')
      .send({query: {name: "Gilbert", email: "GGG@makersquare.com", github: "Wizard"}})
      .expect(200)

    var fellow = yield request(app)
    .post('/api/interviewer/create')
    .send({full_name: "Festus Fellow"})
    .expect(201)

    yield request(app)
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
      console.log("interview test", response.body[0])
      expect(response.body[0].technical_grade).to.equal("A")
    })
  })
})

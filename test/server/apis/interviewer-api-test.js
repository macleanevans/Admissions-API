require(TEST_HELPER) // <--- This must be at the top of every test file.

var request = require('supertest-as-promised')
var routes = require(__server + '/index.js')
var InterviewerApi = require(__server + '/apis/interviewer-api.js')
var Interviewers = require(__server + '/models/interviewer.js')

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
  app.use('/api/interviewer', InterviewerApi)
  app.testReady()

  beforeEach_(function * () {
    currentUser = { uid: 'alice', name: 'Alice' }
    memberedGroups = [{ uid: 'g1', user_role: 'fellow' }]

    yield Interviewers.deleteTable()
  })

  it_("should add a new interviewer on request if theyre not in the system", function * (){
    yield request(app)
     .post('/api/interviewer/create')
     .send({full_name: "Festus Fellow"})
     .expect(201)
     .expect(function(response){
       var fellow = response.body;
       expect(fellow.full_name).to.equal("Festus Fellow")
     })
  })

  it_("should not add an interviewer if theyre already in the system", function * (){
    yield request(app)
    .post('/api/interviewer/create')
    .send({full_name: "Festus Fellow"})
    .expect(201)

    yield request(app)
    .post('/api/interviewer/create')
    .send({full_name: "Festus Fellow"})
    .expect(404)
    .expect(function(response){
      expect(response.body.message).to.equal("Fellow already exists")
    })
  })
})

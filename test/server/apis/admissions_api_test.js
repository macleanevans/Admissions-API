require(TEST_HELPER) // <--- This must be at the top of every test file.

var request = require('supertest-as-promised')
var routes = require(__server + '/index.js')
var InterviewApi = require(__server + '/apis/interview-api.js')
var Ticket = require(__server + '/models/ticket.js')

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
  app.use('/api/admissions/interview', InterviewApi)
  app.testReady()

  beforeEach_(function * () {
    currentUser = { uid: 'alice', name: 'Alice' }
    memberedGroups = [{ uid: 'g1', user_role: 'fellow' }]

    // yield Ticket.deleteEverything()
    // yield db.deleteEverything()
  })

  it_("allows you to add an interview date", function * () {

    var res = yield request(app)
      .post('/api/admissions/interview')
      .send({name: "Mitch"})
      .expect(201)
      .expect(function(response) {
        var interview = response.body
        expect(interview.name).to.equal("Mitch");
        return interview;
      })

    // yield request(app)
    //   .get('/api/groups/g1/tickets/' + res.body.id)
    //   .expect(200)
    //   .expect(function(response) {
    //     var ticket = response.body
    //     expect(ticket.question).to.equal('Where is my cold brew?')
    //   })

  })
})

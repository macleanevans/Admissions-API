require(TEST_HELPER) // <--- This must be at the top of every test file.

var request = require('supertest-as-promised')
var routes = require(__server + '/index.js')
var TicketApi = require(__server + '/apis/tickets-api.js')
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
  app.use('/api/groups/:group_uid/tickets', TicketApi)
  app.testReady()

  beforeEach_(function * () {
    currentUser = { uid: 'alice', name: 'Alice' }
    memberedGroups = [{ uid: 'g1', user_role: 'fellow' }]

    // Simulate an admin user (see makerpass.js)
    // session.admin = {
    //   groups: ['g1']
    // }
    yield Ticket.deleteEverything()
    // yield db.deleteEverything()
  })

  it_("notifies fellows of a new help request", function * () {
    // step 2 submit a help request

    // step 3 each client should receive notification
    //
    // Notice how we're in a generator function (indicated by the the *)
    // See test/test-helper.js for details of why this works.
    //
    var res = yield request(app)
      .post('/api/groups/g1/tickets')
      .send({question: 'Where is my cold brew?'})
      .expect(201)
      .expect(function(response) {
        var ticket = response.body
        expect(ticket.id).to.not.equal(undefined)
        return ticket
        // expect(ticket._links.watch).to.equal(`/api/help-tickets/${ ticket.id }/watch`)
      })

    yield request(app)
      .get('/api/groups/g1/tickets/' + res.body.id)
      .expect(200)
      .expect(function(response) {
        var ticket = response.body
        expect(ticket.question).to.equal('Where is my cold brew?')
      })

  })

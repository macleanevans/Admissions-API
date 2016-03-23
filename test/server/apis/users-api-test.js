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
  app.use('/api/users', UsersApi)
  app.testReady()

  beforeEach_(function * () {
    currentUser = { uid: 'alice', name: 'Alice' }
    memberedGroups = [{ uid: 'g1', user_role: 'fellow' }]

    yield Users.deleteTable()
  })

  it_("sends back a 201 if the user isnt already in our system", function * () {

    var res = yield request(app)
      .post('/api/users')
      .send({query: {name: "Michael", email: "mw@makersquare.com", github: "themanmw"}})
      .expect(201)
      .expect(function(response) {
        var user = response.body
        console.log("user", user)
        expect(user.name).to.equal("Michael");
          return user;
      })
  })

})

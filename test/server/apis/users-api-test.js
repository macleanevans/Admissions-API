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

    yield Users.deleteTable()
  })

  it_("sends back a 200 if the user isnt already in our system", function * () {

    return request(app)
      .get('/api/users')
      .send({query: {name: "Mac", email: "me@makersquare.com", github: "maclean"}})
      .expect(200)
      .expect(function(response) {
        var user = response.body
        console.log("user", user)
        expect(user.blackout).to.equal(null);
          return user;
      })
  })

    it_("should be able to set a blackout period for a user", function * (){
      return request(app)
        .post('/api/users/blackout/')
        .send({email: 'mw@makersquare.com', blackout: 2})
        .expect(201)
      })

    it_("should send back 404 if the user is not past their blackout peroid", function * (){
      return request(app)
       .get('/api/users')
       .send({query: {email: 'mw@makersquare.com'}})
       .expect(404)
    })

    it_("sends back a 200 if they are in the system and do not have a blackout", function * (){
      return request(app)
      .get('/api/users')
      .send({query: {name: "Samantha", email: "sw@makersquare.com", github: "manthamachine"}})
      .expect(200)
      .expect(function(response){
        var user = response.body;
        expect(user.name).to.equal('Samantha')
        expect(user.blackout).to.equal(null)
          return user
      })
    })

    it_("Should be able to get names of all users in the system", function * (){
      return request(app)
       .get('/api/users/applicants')
       .expect(200)
       .expect(function(response){
         console.log("getAll response", response.body)
       })
    })

})

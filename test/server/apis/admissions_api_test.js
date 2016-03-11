require(TEST_HELPER) // <--- This must be at the top of every test file.

var request = require('supertest-as-promised')
var routes = require(__server + '/index.js')
var InterviewApi = require(__server + '/apis/interview-api.js')
var Interview = require(__server + '/models/interview.js')

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

    yield Interview.deleteEverything()
    // yield db.deleteEverything()
  })

  it_("allows you to add an interview date", function * () {

    var res = yield request(app)
      .post('/api/admissions/interview')
      .send({date: "2016-02-27"})
      .expect(201)
      .expect(function(response) {
        var interview = response.body
        expect(interview.date).to.equal("2016-02-27");
        return interview;
      })
  })

  it_("should return interview date by ID", function * () {

    var res = yield request(app)
      .post('/api/admissions/interview')
      .send({date: "2016-02-27"})
      .expect(201)
      .expect(function(response) {
        var interview = response.body
        expect(interview.date).to.equal("2016-02-27")
        return interview
      })

      yield request(app)
        .get('/api/admissions/interview/' +res.body.id)
        .expect(200)
        .expect(function(response){
          var interview = response.body;
          expect(interview.date).to.equal("2016-02-27");
        })
  })

  it_("set a soft reject blackout period", function * (){

    var res = yield request(app)
      .post('/api/admissions/interview/blackout')
      .send({date: "2016-03-02", blackout: 1})
      .expect(201)
      .expect(function(response){
        var interview = response.body
        expect(interview.blackout).to.equal(0)
        return interview
      })
  })

  it_("should be able to fetch a blackout date", function * (){
    var res = yield request(app)
      .post('/api/admissions/interview')
      .send({blackout: 0})
      .expect(201)
      .expect(function(response){
        var interview = response.body
        expect(interview.blackout).to.equal(0)
        return interview
      })

      yield request(app)
        .get('/api/admissions/interview/' + res.body.id)
        .expect(200)
        .expect(function(response){
          var interview = response.body;
          expect(interview.blackout).to.equal(0);
        })
  })

  it_("post a technical grade by ID from interview", function * (){
    var res = yield request(app)
      .post('/api/admissions/interview')
      .send({technical_grade: "B"})
      .expect(201)
      .expect(function(response){
        var interview = response.body
        expect(interview.technical_grade).to.equal("B")
        return interview
      })
  })

  it_("should reject interview submission if decision is hard reject", function * (){
    var res = yield request(app)
      .post('/api/admissions/interview')
      .send({technical_grade: "B",
            date: "2016-02-27",
            personal_grade: "A",
            decision:"HR"
            })
      .expect(201)
      .expect(function(response){
        var interview = response.body
        expect(interview.technical_grade).to.equal("B")
        return interview
  })

  var res = yield request(app)
  .post('/api/admissions/interview')
  .send({
    date: "2016-03-12"
  })
    .expect(400)
  })

it_("should notify user they are in a blackout period", function * (){
  var res = yield request(app)
    .post('/api/admissions/interview')
    .send({technical_grade: "B",
          date: "2016-02-27",
          personal_grade: "A",
          decision:"SR",
          blackout: 2
          })
    .expect(201)
    .expect(function(response){
      var interview = response.body
      expect(interview.technical_grade).to.equal("B")
      return interview
    })

    var res = yield request(app)
    .post('/api/admissions/interview/' + res.body.id)
    .send({
      date: "2016-03-12"
    })
      .expect(400)
    })
})

//Need to think of a smart way to log the blackout date

//Lets give the client the option of 1 month, 2 month ect and set the blackout as 1,2 ect..
//When blackout is checked we can compare the last interview date plus the blackout months to the current date
//If we are past the blackout period then reset blackout to 0
//Admin can pull most recent interview and blackout months if requested


//interview date
//blackout period
//technical grade
//personal grade
//decision
//makerpass interviewee ID
//makerpass interviewer ID
//Look at youCanBookMe google drive creation
//Reject situational (personal vs technical)

//Things I really need

//Users Tables
//Interviews Tables
//Interviewer Table



//Can store an interview with intervieweeID(created on first), firstname, lastname, email, github, interview date, blackoutPeriod

//you can look up all interview by interveweeID

//After an interview you can select the interview by intervieweeID and date
  //Once selected you can add: interviewerID, decision, technical grade, personal grade, MakerPrep(Y/N), notes

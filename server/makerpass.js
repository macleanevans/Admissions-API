//
// Authentication with MakerPass
//
var passport = require('passport')
var MP = require('node-makerpass')
var MakerpassStrategy = require('passport-makerpass').Strategy


exports.mount = function (app, host) {

  if (! process.env.MAKERPASS_CLIENT_ID || ! process.env.MAKERPASS_CLIENT_SECRET) {
    throw new Error("Please set MAKERPASS_CLIENT_ID and MAKERPASS_CLIENT_SECRET")
  }

  passport.use(new MakerpassStrategy({
      clientID: process.env.MAKERPASS_CLIENT_ID,
      clientSecret: process.env.MAKERPASS_CLIENT_SECRET,
      callbackURL: host + '/auth/makerpass/callback',
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {


      MP.me.adminStatus(accessToken)
        .then(function (subjects) {
          req.session.accessToken = accessToken
          //
          // Only assign if there are any subjects at all.
          // This makes internal logic easier,
          // and sends less data over the wire.
          //
          if ( subjects.groups.length ) {
            req.session.admin = {
              groups: subjects.groups.map( g => g.uid )
            }
          }
          done(null, profile)
        })
        .catch(function (err) {
          console.log("Error getting admin status:", err)
          done(err)
        })
    }
  ))

  passport.serializeUser(function(profile, done) { done(null, profile) })
  passport.deserializeUser(function(profile, done) { done(null, profile) })

  app.use(passport.initialize())

  app.get('/auth/makerpass',
    passport.authenticate('makerpass'))

  app.get('/auth/makerpass/callback',
    // Don't know how to skip serialize user; redirect home on this "failure".
    // TODO: Need to call passport.authenticate again or can I just check req.user?
    passport.authenticate('makerpass', { failureRedirect: '/login', successRedirect: '/' })
  )

  app.post('/api/signout', function (req, res) {
    req.session = null
    res.send({})
  })

  app.get('/signout', function (req, res) {
    req.session = null
    res.redirect('/login')
  })

}

//
// Authentication with MakerPass
//
var passport = require('passport')
var MP = require('node-makerpass')
var MakerpassStrategy = require('passport-makerpass').Strategy
var fetch = require("isomorphic-fetch")

var App = {}

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

          App.picture = profile.avatar_url
          App.name = profile.name
          App.email = profile.email

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
    passport.authenticate('makerpass', { failureRedirect: '/login' }),
    function (req, res){

      var isAdmin = !!req.session.admin
      var isFellow = false
      var isInstructor = false

      MP.me.groups(req.session.accessToken).then(function(groups) {

        groups.forEach(function(cohorts){
          if(cohorts.user_role === 'fellow')     isFellow = true
          if(cohorts.user_role === 'instructor') isInstructor = true
        })

        isAdmin = !!req.session.admin

      })
      .then(function(){
        if(!isInstructor && !isAdmin && !isFellow) {
          res.redirect('/nope')
        } else {
          res.cookie("picture", App.picture)
          res.cookie("name", App.name)
          res.cookie("email", App.email)
          res.redirect('/')
        }
      })
    }
  )

  app.get('/signout', function (req, res) {
    res.clearCookie("picture")
    res.clearCookie("name")
    res.clearCookie("email")
    res.clearCookie("learn:session")
    res.clearCookie("learn:session.sig")

    req.session = null
    res.redirect('/')
  })
}

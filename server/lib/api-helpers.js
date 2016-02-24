var util = require('util')
var MP   = require('node-makerpass')

var Promise  = require('bluebird')
var passport = require('passport')


var API = module.exports = {}

API.prep = function (statusCode, res) {
  return function (x) {

    if (x instanceof Error) {
      if (! res._sent) {
        res._sent = true
        res.status(statusCode).send({ reason: x.message })
        return Promise.reject(new API.ResponseSent(statusCode))
      }
    }
    else if (! res._sent) {
      res.status(statusCode).send(x)
      res._sent = true
      return Promise.reject(new API.ResponseSent(statusCode))
    }

  }
}

API.catchErrors = function (res) {
  return function (x) {
    if (! (x instanceof API.ResponseSent) && ! res._sent) {
      if (process.env.NODE_ENV == 'test') {
        console.log("API ERROR:", util.inspect(x, { depth: 8 }))
      }
      res._sent = true
      res.status(500).send({ message: x.message })
    }
  }
}

API.auth = function (req, res, next) {
  if (! req.user) return unauthorized(401, res)
  next()
}

API.authAdmin = function (req, res, next) {
  if (! req.user) return unauthorized(401, res)
  if (! req.session.admin) return unauthorized(403, res)
  next()
}

API.authSession = MP.authWithSession

API.fetchGroups = function (req, res, next) {
  MP.me.groups(req.session.accessToken)
    .then(function(groups) {
      req.groups = groups
      next()
    })
    .catch(next)
}

API.authMembership = function (paramName) {
  return function (req, res, next) {
    if ( req.groups && req.groups.find( g => g.uid === req.params[paramName] ) ) {
      next()
    }
    else {
      res.status(403).send({ reason: "not_group_member", group: req.params.group_uid })
    }
  }
}

API.authGroupAdmin = function (paramName) {
  return function (req, res, next) {
    if ( req.session.admin && req.session.admin.groups.indexOf( req.params[paramName] ) >= 0 ) {
      next()
    }
    else {
      res.status(403).send({ reason: "not_admin_of_group", group: req.params.group_uid })
    }
  }
}

API.fullUrl = function (req) {
  return req.protocol + '://' + req.get('host') + req.originalUrl
}

API.ResponseSent = function ResponseSent (statusCode) {
  Error.captureStackTrace(this, this.constructor)
  this.name = 'ResponseSent'
  this.message = 'response_sent'
  this.code = statusCode
}
util.inherits(API.ResponseSent, Error)

function unauthorized (code, res) {
  return res.status(code).send({ reason: 'unauthorized' })
}

var express = require('express')
var MP      = require('node-makerpass')
var API     = require('../lib/api-helpers')

var router = module.exports = express.Router()

router.get('/', API.auth, function (req, res) {

  MP.me.groups(req.session.accessToken).then(function(groups) {

    res.send({
      user: Object.assign(req.user, { isAdmin: !! req.session.admin }),
      groups: groups
    })

  })
  .catch( API.catchErrors(res) )
})

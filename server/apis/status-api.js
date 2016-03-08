var express = require('express')
var MP      = require('node-makerpass')
var API     = require('../lib/api-helpers')


var router = module.exports = express.Router({ mergeParams: true })

router.get('/', SSE, function (req, res) {

  var interval = setInterval(function(){
    if ( res.disconnected ) return clearTimeout(interval)
    res.emit({ type: 'pulse', group_uid: req.params.group_uid })
  }, 3000)

})


//
// Server-Sent Events middleware helper
// https://www.terlici.com/2015/12/04/realtime-node-expressjs-with-sse.html
//
var groupListeners = {}

function SSE (req, res, next) {

  // Write head immediately
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  // Define helper function
  res.emit = function(data) {
    res.write("data: " + JSON.stringify(data) + "\n\n");
  }

  // Bookkeeping
  var uid = req.param.group_uid
  if (! groupListeners[ uid ] ) groupListeners[ uid ] = []

  groupListeners[ uid ].push({ group_uid: uid, res: res })

  var remove = function () {
    res.disconnected = true
    groupListeners[ uid ] = groupListeners[ uid ].filter( c => c.res === res )
  }

  req.on('close', remove)
  req.on('end',   remove)

  next()
}

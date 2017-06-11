'use strict'
const stream = require('stream')
const FeedMe = require('feedme')
const duplexify = require('duplexify')

module.exports = feedstream

function feedstream () {
  const feed = new FeedMe()
  const out = new stream.PassThrough({objectMode: true})
  feed.on('item', item => out.write(item))
  feed.on('error', err => out.emit('error', err))
  feed.on('end', () => out.end())
  return duplexify.obj(feed, out)
}

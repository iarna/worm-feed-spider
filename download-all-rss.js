'use strict'
const promisify = require('fetch-fic/util/promisify')
const fs = require('fs')
const Bluebird = require('bluebird')
const writeFile = promisify(fs.writeFile)
const os = require('os')
const fetch = require('make-fetch-happen')

const urls = {
  'ao3.atom': 'http://archiveofourown.org/tags/3319154/feed.atom',
  'ffnet.atom': 'https://www.fanfiction.net/atom/l/?&cid1=10867&r=10&s=1',
  'sb-worm.rss': 'https://forums.spacebattles.com/forums/worm.115/index.rss',
  'sb-cw.rss': 'https://forums.spacebattles.com/forums/creative-writing.18/index.rss',
  'sb-quest.rss': 'https://forums.spacebattles.com/forums/roleplaying-quests.60/index.rss',
  'sv-cw.rss': 'https://forums.sufficientvelocity.com/forums/user-fiction.2/index.rss',
  'sv-quest.rss': 'https://forums.sufficientvelocity.com/forums/quests.29/index.rss',
  'qq-cw.rss': 'https://forum.questionablequesting.com/forums/creative-writing.19/index.rss',
  'qq-quest.rss': 'https://forum.questionablequesting.com/forums/questing-and-roleplay.20/index.rss'
}

Bluebird.map(Object.keys(urls), file => fetch(urls[file]).then(res=> writeFile(`${__dirname}/data/${file}`, res.buffer())))


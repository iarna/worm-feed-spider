'use strict'
const UpdateRSS = require('./rss.js')

main()

async function main () {
  const update = new UpdateRSS()
  await Promise.all([
    update.read(`${__dirname}/data/ao3.atom`),
    update.read(`${__dirname}/data/ffnet.atom`),
    update.read(`${__dirname}/data/sb-worm.rss`),
    update.read(`${__dirname}/data/sb-cw.rss`, true),
    update.read(`${__dirname}/data/sb-quest.rss`, true),
    update.read(`${__dirname}/data/sv-cw.rss`, true),
    update.read(`${__dirname}/data/sv-quest.rss`, true),
    update.read(`${__dirname}/data/qq-cw.rss`, true),
    update.read(`${__dirname}/data/qq-quest.rss`, true)
  ])
  await update.write()
  process.stdout.write('\n')
}

'use strict'
const fs = require('fs')
const promisify = require('bluebird').promisify
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const fun = require('funstream')
const feedstream = require('./feedstream.js')
const index = require('../.meta.index.json')
const metaPath = '../'
const TOML = require('@iarna/toml')
require('fetch-fic')
const Fic = require('fetch-fic/fic')
const moment = require('moment')
const sortedObject = require('sorted-object')
const blacklist = require('./blacklist.json')
const linkNormalize = require('./link-normalize.js')

Object.keys(blacklist).forEach(k => blacklist[linkNormalize(k)] = true)

const indexLink = {}
Object.keys(index.link).forEach(l => indexLink[l] = linkNormalize(l))

class UpdateRSS {
  constructor () {
    this.todo = this.readTODO()
    this.lastSeen = this.readLastSeen()
  }
  async readTODO () {
    try {
      return JSON.parse(await readFile('./work-todo.json'))
    } catch (ex) {
      return {
        'update': {},
        'add': {}
      }
    }
  }
  async readLastSeen () {
    try {
      return JSON.parse(await readFile('./last-seen.json'))
    } catch (ex) {
      return {}
    }
  }
  async write () {
    const todo = await this.todo
    todo.update = sortedObject(todo.update)
    todo.add = sortedObject(todo.add)
    return Promise.all([
      writeFile('./work-todo.json', JSON.stringify(await this.todo, null, 2)),
      writeFile('./last-seen.json', JSON.stringify(sortedObject(await this.lastSeen), null, 2)),
    ])
  }
  async read (file, wormFilter) {
    let todo = await this.todo
    let lastSeen = await this.lastSeen
    return fun(fs.createReadStream(file))
      .pipe(feedstream())
      .map(item => ({
        raw: item,
        title: item.title,
        updated: item.updated || item.pubdate,
        link: item.link.href ? item.link.href : item.link,
        linkN: linkNormalize(item.link.href ? item.link.href : item.link),
        author: item.author ? item.author.name : item['dc:creator'],
        summary: item.summary || item['content:encoded'],
        comments: item['slash:comments']
      }))
      .filter(item => !wormFilter || /worm/i.test(item.title))
      .filter(item => !/axxor/i.test(item.author))
      .filter(item => !blacklist[item.linkN])
      .map(item => {
        process.stdout.write('.')
        const matches = Object.keys(index.link)
          .filter(l => indexLink[l].slice(0, item.linkN.length) === item.linkN || indexLink[l] === item.linkN.slice(0, indexLink[l].length))
        if (matches) item.file = index.link[matches[0]]
        if (!item.file) item.file = titleMatch(item.title)
        if (!item.file) {
          todo.add[item.linkN] = item.title
        }
        return item
      })
      .filter(item => item.file)
      .filter(async item => {
        if (!lastSeen[item.file]) {
          const fic = Fic.fromJSON(TOML.parse(await readFile(`${metaPath}/${item.file}`)))
          lastSeen[item.file] = fic.modified.toISOString()
        }
        return moment(lastSeen[item.file]).isBefore(item.updated)
      })
      .forEach(item => {
        lastSeen[item.file] = moment(item.updated).toISOString()
        todo.update[item.file] = (todo.update[item.file] || 0) + 1
      }).catch(err => {
        console.error(err.stack)
        throw err
      })
  }
}


module.exports = UpdateRSS

function titleMatch (lookup) {
  let matches
  if (index.title[lookup]) {
    matches = index.title[lookup]
  } else {
    matches = []
    Object.keys(index.title).forEach(title => {
      if (lookup.slice(0, title.length) === title) {
        matches = matches.concat(index.title[title])
      }
    })
  }
  if (matches.length > 1) {
    console.warn('ambinguous title', lookup, index.title[lookup])
  } else if (matches.length > 0) {
    return matches[0]
  }
}

'use strict'
module.exports = linkNormalize

function linkNormalize (link) {
  return link
    .replace(/https?:/, 'https:')
    .replace(/forum.question/, 'question')
    .replace(/[/]fanfiction[.]net/, '/www.fiction.net')
    .replace(/[/]$/, '')
    .replace(/[/]s[/](\d+)[/].*$/, '/s/$1')
    .replace(/[/]threads[/].*#post-(\d+)/, '/posts/$1')
    .replace(/(threads[/]).*[.](\d+)$/, '$1$2')
}

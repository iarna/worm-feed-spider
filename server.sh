#!/bin/bash
while true; do
  node download-all-rss.js
  node load-all-rss.js
  git add last-seen.json work-todo.json
  git commit -m'feed update'
  sleep 450
done

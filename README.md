# worm-feed-spider

Scan worm-related RSS feeds for updates and new fics.

## Details

So this is the thing I look for updates for the
weekly [new and updated Worm fanfiction](github.com/iarna/worm-whats-new)
post.

There are two bits that this requires that aren't included here. 
Specifically we require `.meta.index.json` which is an index of all of the
fic metadata I have stored and I load those metadata from `../`.

This is probably most interesting for the URLs in `download-all-rss.js`. 

The other thing worth noting is that I only include posts with `worm` in their
titles in all of the sb/sv/qq feeds that aren't for the worm subforum.

---
layout: page
title:  "Tampermonkey Scripts"
---

## Bandcamp Tab Player

Test Short link: <bandcamp_player.js>
Test Full link: [/tampermonkey/bandcamp_player.js](bandcamp_player.js)

Play through all open bandcamp.com tabs that have songs on them. Bandcamp lets you play songs before buying them, but 
only one page at a time. This script will coordinate with all open tabs and play songs from each one.

**Status**: In Development

### TODO

- More work on getting hooked into end of playlist in bandcamp player
- Play songs in tab order left to right if possible
- Mark which songs / tabs have been played
- Jump to currently playing tab

## Close Duplicate Tabs

**Status**: Working

### TODO

- Upload the script
- Identify duplicate tabs when query string differs, e.g. `?utm=blah`

## Unicode Viewer

**Status**: Alpha

### TODO

- Upload the script
- Group by section
- Metadata about characters on hover
- Expand/collapse sections
- Toggle boring stuff
- Toggle characters that break layout
- Move the fun stuff to the top
- Identify what characters are most fun x most frequently supported in fonts
- Test strings that cover multiple categories. e.g. if you support spades suit character, you probably support all the suits. Want to get most bang for buck copy + paste testing.
- Fun combos for names or drawing stuff?

## TODO

- Move these to their own github repo.
- Link to install as userscript?

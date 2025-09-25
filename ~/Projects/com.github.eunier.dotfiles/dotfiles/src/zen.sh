#!/usr/bin/env bash

# pwd
# /home/yunieralvarez/.zen/ijtmybpn.Default (release)
# TODO

cp places.sqlite places-backup.sqlite && sqlite3 -csv -header places-backup.sqlite \
                                                              "SELECT moz_bookmarks.title, moz_places.url FROM moz_bookmarks JOIN moz_places ON moz_bookmarks.fk = moz_places.id WHERE moz_bookmarks.title IS NOT NULL;" > ~/Downloads/bookmarks.csv

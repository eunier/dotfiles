#!/usr/bin/env bash

# # TODO switch to rsync
# rm -rf /run/media/tron/External/KeePass
# cp -r ~/Documents/Applications/KeePass /run/media/tron/External/KeePass/

rsync -av --delete ~/Documents/Applications/KeePass/ /run/media/tron/External/KeePass/

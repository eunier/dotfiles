#!/usr/bin/env bash

# # TODO switch to rsync
# rm -rf /run/media/tron/External/KeePass
# cp -r ~/Documents/Applications/KeePass /run/media/tron/External/KeePass/

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles


rsync -av --delete ~/Documents/Applications/KeePass/ /run/media/tron/External/KeePass/

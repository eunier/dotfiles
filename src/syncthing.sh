#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

touch $REPO_PATH/src/syncthing/syncthing-config-before.json
syncthing cli config dump-json >$REPO_PATH/src/syncthing/syncthing-config-after.json

cd $REPO_PATH || exit
bun run syncthing:config:mask

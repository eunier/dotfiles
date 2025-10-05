#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

syncthing cli config dump-json >$REPO_PATH/src/syncthing/syncthing-config_"$COMPUTER_MODEL".json

cd $REPO_PATH || exit
bun run syncthing:config:mask

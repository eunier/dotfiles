#!/usr/bin/env bash

touch ~/.dotfiles/src/syncthing/syncthing-config-before.json
syncthing cli config dump-json >~/.dotfiles/src/syncthing/syncthing-config-after.json

cd ~/.dotfiles || exit
bun run syncthing:config:mask

#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

AUTOSTART_TXT_PATH=$REPO_PATH/src/autostart/autostart_$COMPUTER_MODEL.txt
tree ~/.config/autostart >"$AUTOSTART_TXT_PATH"
tree -aDgNpqsu ~/.config/autostart >>"$AUTOSTART_TXT_PATH"

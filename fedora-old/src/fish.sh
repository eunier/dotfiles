#!/usr/bin/bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

DEST="$REPO_PATH/src/files/$COMPUTER_MODEL/home/.config/fish/config.fish.txt"
mkdir -p "$(dirname "$DEST")"
cp ~/.config/fish/config.fish "$DEST"

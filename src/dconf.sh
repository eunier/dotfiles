#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

dconf dump / >$REPO_PATH/src/dconf/dconf-raw_"$COMPUTER_MODEL".conf
cd $REPO_PATH || exit
bun run dconf:dconf-filter

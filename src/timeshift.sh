#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

cp /etc/timeshift/timeshift.json $REPO_PATH/src/timeshift/timeshift_"$COMPUTER_MODEL".json

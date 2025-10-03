#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

tree . -a -I ".git|node_modules" >$REPO_PATH/src/tree/tree-output_"$COMPUTER_MODEL".txt

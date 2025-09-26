#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

cp ~/.bashrc ~/.dotfiles/src/files/after/home/~/.bashrc
cp ~/.bash_profile ~/.dotfiles/src/files/after/home/~/.bash_profile

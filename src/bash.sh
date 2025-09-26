#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

BASHRC_DEST=~/.bashrc $REPO_PATH/src/files/"$COMPUTER_MODEL"/home/~/.bashrc
mkdir -p "$(dirname "$BASHRC_DEST")"
cp ~/.bashrc "$BASHRC_DEST"

BASHRC_PROFILE_DEST=~/.bash_profile $REPO_PATH/src/files/"$COMPUTER_MODEL"/home/~/.bash_profile
mkdir -p "$(dirname "$BASHRC_PROFILE_DEST")"
cp ~/.bash_profile "$BASHRC_PROFILE_DEST"

# cp ~/.bashrc ~/.dotfiles/src/files/after/home/~/.bashrc
# cp ~/.bash_profile ~/.dotfiles/src/files/after/home/~/.bash_profile

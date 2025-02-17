#!/usr/bin/env bash

touch ~/.dotfiles/src/beaver-notes/beaver-notes-before.txt

flatpak search com.beavernotes.beavernotes > ~/.dotfiles/src/beaver-notes/beaver-notes-after.txt
nala show beaver-notes >> ~/.dotfiles/src/beaver-notes/beaver-notes-after.txt
#!/usr/bin/env bash

echo "Diffing beaver-notes..."

diff --color \
  ~/.dotfiles/src/beaver-notes/beaver-notes-before.txt \
  ~/.dotfiles/src/beaver-notes/beaver-notes-after.txt
